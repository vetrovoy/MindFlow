import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { getCopy } from '@mindflow/copy';

import {
  AUTH_MIN_PASSWORD_LENGTH,
  createAuthSession,
  createLocalAuthUser,
  createPasswordSalt,
  findUserByEmail,
  hashPassword,
  isValidEmail,
  persistAuthSnapshot,
  readAuthSnapshot,
  verifyPassword,
  type AuthSession,
  type LocalAuthUser,
} from '@shared/lib/auth';
import { getRuntimeLanguage } from '@shared/lib/language';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthStoreState {
  session: AuthSession | null;
  users: LocalAuthUser[];
}

export interface AuthStoreActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  signOut: () => void;
}

export interface AuthStore {
  state: AuthStoreState;
  actions: AuthStoreActions;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCopyForLanguage() {
  return getCopy(getRuntimeLanguage());
}

function validateSignIn(email: string, password: string): string | null {
  const copy = getCopyForLanguage();
  if (!isValidEmail(email)) return copy.auth.invalidEmailError;
  if (password.length === 0) return copy.auth.invalidCredentialsError;
  return null;
}

function validateSignUp(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): string | null {
  const copy = getCopyForLanguage();
  if (name.trim().length === 0) return copy.auth.nameRequiredError;
  if (!isValidEmail(email)) return copy.auth.invalidEmailError;
  if (password.length < AUTH_MIN_PASSWORD_LENGTH) return copy.auth.passwordTooShortError;
  if (password !== confirmPassword) return copy.auth.passwordMismatchError;
  return null;
}

function getAuthCopy() {
  return getCopyForLanguage();
}

// ─── Store ────────────────────────────────────────────────────────────────────

// Auth store is a module-level singleton — no provider needed.
// MMKV is synchronous so we hydrate immediately at store creation.
const authStoreApi = createStore<AuthStore>((set, get) => {
  const snapshot = readAuthSnapshot();

  const patchState = (patch: Partial<AuthStoreState>) => {
    set(store => ({ state: { ...store.state, ...patch } }));
  };

  const actions: AuthStoreActions = {
    async signIn(email, password) {
      const error = validateSignIn(email, password);
      if (error != null) throw new Error(error);

      const { users } = get().state;
      const user = findUserByEmail(users, email);
      if (user == null || !verifyPassword(password, user)) {
        const copy = getAuthCopy();
        throw new Error(copy.auth.invalidCredentialsError);
      }

      const session = createAuthSession(user);
      const stored = readAuthSnapshot();
      persistAuthSnapshot({ ...stored, session });
      patchState({ session });
    },

    async signUp(name, email, password, confirmPassword) {
      const error = validateSignUp(name, email, password, confirmPassword);
      if (error != null) throw new Error(error);

      const { users } = get().state;
      if (findUserByEmail(users, email) != null) {
        const copy = getAuthCopy();
        throw new Error(copy.auth.duplicateEmailError);
      }

      const salt = createPasswordSalt();
      const hash = hashPassword(password, salt);
      const user = createLocalAuthUser({
        name,
        email,
        passwordSalt: salt,
        passwordHash: hash,
      });

      const session = createAuthSession(user);
      const nextUsers = [...users, user];
      persistAuthSnapshot({ version: 1, users: nextUsers, session });
      patchState({ users: nextUsers, session });
    },

    signOut() {
      const stored = readAuthSnapshot();
      persistAuthSnapshot({ ...stored, session: null });
      patchState({ session: null });
    },
  };

  return {
    state: {
      session: snapshot.session,
      users: snapshot.users,
    },
    actions,
  };
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export function useAuthStore<T>(selector: (store: AuthStore) => T): T {
  return useStore(authStoreApi, selector);
}

export { authStoreApi };
