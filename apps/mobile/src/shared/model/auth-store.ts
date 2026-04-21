import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { getCopy } from '@mindflow/copy';
import { AuthClient, AuthHttpError } from '@mindflow/data';

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
import { logError } from '@shared/lib/error-logger';
import { Config } from '@shared/config';

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
  if (password.length < AUTH_MIN_PASSWORD_LENGTH)
    return copy.auth.passwordTooShortError;
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

      // Try backend auth if enabled
      if (Config.isBackendEnabled && Config.apiBaseUrl != null) {
        try {
          const client = new AuthClient({ baseUrl: Config.apiBaseUrl });
          const normalizedEmail = email.trim().toLowerCase();
          const response = await client.login({
            email: normalizedEmail,
            password,
          });
          const users = get().state.users;
          let user = findUserByEmail(users, normalizedEmail);

          // Create local user record if not exists (for offline fallback)
          if (user == null) {
            const salt = createPasswordSalt();
            const hash = hashPassword(password, salt);
            user = createLocalAuthUser({
              name: response.user.name,
              email: response.user.email,
              passwordSalt: salt,
              passwordHash: hash,
            });
            const nextUsers = [...users, user];
            persistAuthSnapshot({
              version: 1,
              users: nextUsers,
              session: createAuthSession(user, response.token),
            });
            patchState({
              users: nextUsers,
              session: createAuthSession(user, response.token),
            });
          } else {
            const session = createAuthSession(user, response.token);
            const stored = readAuthSnapshot();
            persistAuthSnapshot({ ...stored, session });
            patchState({ session });
          }
          return;
        } catch (err) {
          // HTTP client errors (401, 409, etc.) should be shown to the user
          if (err instanceof AuthHttpError && err.isClientError) {
            throw err;
          }
          // Network errors — fall through to local auth
          logError(err, { action: 'signIn.backend' });
        }
      }

      // Local-only auth
      const { users } = get().state;
      const localUser = findUserByEmail(users, email);
      if (localUser == null || !verifyPassword(password, localUser)) {
        const copy = getAuthCopy();
        throw new Error(copy.auth.invalidCredentialsError);
      }

      const session = createAuthSession(localUser);
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

      // Try backend registration if enabled
      if (Config.isBackendEnabled && Config.apiBaseUrl != null) {
        try {
          const client = new AuthClient({ baseUrl: Config.apiBaseUrl });
          const normalizedEmail = email.trim().toLowerCase();
          const response = await client.register({
            name,
            email: normalizedEmail,
            password,
          });

          // Store local record with password hash for offline fallback
          const salt = createPasswordSalt();
          const hash = hashPassword(password, salt);
          const user = createLocalAuthUser({
            name: response.user.name,
            email: response.user.email,
            passwordSalt: salt,
            passwordHash: hash,
          });

          const session = createAuthSession(user, response.token);
          const nextUsers = [...users, user];
          persistAuthSnapshot({ version: 1, users: nextUsers, session });
          patchState({ users: nextUsers, session });
          return;
        } catch (err) {
          // HTTP client errors (409 duplicate, etc.) should be shown to the user
          if (err instanceof AuthHttpError && err.isClientError) {
            throw err;
          }
          // Network errors — fall through to local registration
          logError(err, { action: 'signUp.backend' });
        }
      }

      // Local-only registration — save pendingPassword for deferred backend sync
      const salt = createPasswordSalt();
      const hash = hashPassword(password, salt);
      const user = createLocalAuthUser({
        name,
        email,
        passwordSalt: salt,
        passwordHash: hash,
        pendingPassword: password,
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

// ─── Offline Registration Sync ───────────────────────────────────────────────

import { startOfflineRegistrationSync } from '@shared/lib/offline-registration-sync';
import Toast from 'react-native-toast-message';

let stopOfflineSync: (() => void) | null = null;

/**
 * Initialize offline registration sync.
 * Must be called AFTER module load (e.g., from a React effect or app entry)
 * to avoid accessing authStoreApi before it's fully constructed.
 */
export function initOfflineRegistrationSync(): () => void {
  if (stopOfflineSync != null) return stopOfflineSync;

  stopOfflineSync = startOfflineRegistrationSync(
    nextSnapshot => {
      console.log('[AuthStore] Offline sync completed — updating session.');
      authStoreApi.setState(store => ({
        state: {
          ...store.state,
          session: nextSnapshot.session,
          users: nextSnapshot.users,
        },
      }));
    },
    errorMessage => {
      console.error('[AuthStore] Offline sync error:', errorMessage);
      Toast.show({ type: 'error', text1: errorMessage });
    },
  );

  return stopOfflineSync;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function useAuthStore<T>(selector: (store: AuthStore) => T): T {
  return useStore(authStoreApi, selector);
}

export { authStoreApi };
