import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import { getRuntimeCopy } from "@/shared/lib/language";
import {
  AUTH_MIN_PASSWORD_LENGTH,
  createAuthSession,
  createLocalAuthUser,
  createPasswordSalt,
  findAuthUserByEmail,
  hashPassword,
  isValidAuthEmail,
  normalizeAuthEmail,
  persistAuthSnapshot,
  readStoredAuthSnapshot,
  verifyPassword,
  type AuthSession,
  type AuthStorageSnapshot,
  type LocalAuthUser
} from "@/shared/lib/auth";
import { migrateLegacyAnonymousData } from "@/shared/lib/auth-migration";

export interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  session: AuthSession | null;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderState {
  users: LocalAuthUser[];
  session: AuthSession | null;
  legacyMigrated: boolean;
  isHydrated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createProviderState(snapshot: AuthStorageSnapshot): AuthProviderState {
  return {
    users: snapshot.users,
    session: snapshot.session,
    legacyMigrated: snapshot.legacyMigrated,
    isHydrated: true
  };
}

function toSnapshot(state: Pick<AuthProviderState, "users" | "session" | "legacyMigrated">) {
  return {
    users: state.users,
    session: state.session,
    legacyMigrated: state.legacyMigrated
  } satisfies AuthStorageSnapshot;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthProviderState>(() =>
    createProviderState(readStoredAuthSnapshot())
  );

  const commitState = useCallback((nextSnapshot: AuthStorageSnapshot) => {
    persistAuthSnapshot(nextSnapshot);
    setState(createProviderState(nextSnapshot));
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const copy = getRuntimeCopy();
      const normalizedEmail = normalizeAuthEmail(email);

      if (!isValidAuthEmail(normalizedEmail)) {
        throw new Error(copy.auth.invalidEmailError);
      }

      if (password.length < AUTH_MIN_PASSWORD_LENGTH) {
        throw new Error(copy.auth.passwordTooShortError);
      }

      const user = findAuthUserByEmail(state.users, normalizedEmail);
      if (user == null || !(await verifyPassword(password, user))) {
        throw new Error(copy.auth.invalidCredentialsError);
      }

      let nextSnapshot: AuthStorageSnapshot = {
        users: state.users,
        session: createAuthSession(user),
        legacyMigrated: state.legacyMigrated
      };

      if (!nextSnapshot.legacyMigrated) {
        await migrateLegacyAnonymousData(user.id);
        nextSnapshot = {
          ...nextSnapshot,
          legacyMigrated: true
        };
      }

      commitState(nextSnapshot);
    },
    [commitState, state.legacyMigrated, state.users]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string, confirmPassword: string) => {
      const copy = getRuntimeCopy();
      const normalizedEmail = normalizeAuthEmail(email);

      if (!isValidAuthEmail(normalizedEmail)) {
        throw new Error(copy.auth.invalidEmailError);
      }

      if (password.length < AUTH_MIN_PASSWORD_LENGTH) {
        throw new Error(copy.auth.passwordTooShortError);
      }

      if (password !== confirmPassword) {
        throw new Error(copy.auth.passwordMismatchError);
      }

      if (findAuthUserByEmail(state.users, normalizedEmail) != null) {
        throw new Error(copy.auth.duplicateEmailError);
      }

      const passwordSalt = createPasswordSalt();
      const passwordHash = await hashPassword(password, passwordSalt);
      const user = createLocalAuthUser({
        name,
        email: normalizedEmail,
        passwordSalt,
        passwordHash
      });
      const nextUsers = [...state.users, user];
      let nextSnapshot: AuthStorageSnapshot = {
        users: nextUsers,
        session: createAuthSession(user),
        legacyMigrated: state.legacyMigrated
      };

      if (!nextSnapshot.legacyMigrated) {
        await migrateLegacyAnonymousData(user.id);
        nextSnapshot = {
          ...nextSnapshot,
          legacyMigrated: true
        };
      }

      commitState(nextSnapshot);
    },
    [commitState, state.legacyMigrated, state.users]
  );

  const signOut = useCallback(() => {
    commitState({
      ...toSnapshot(state),
      session: null
    });
  }, [commitState, state]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isHydrated: state.isHydrated,
      isAuthenticated: state.session != null,
      session: state.session,
      signIn,
      signUp,
      signOut
    }),
    [signIn, signOut, signUp, state.isHydrated, state.session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context == null) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
