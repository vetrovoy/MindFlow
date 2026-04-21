import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import { AuthClient, AuthHttpError } from "@mindflow/data";

import { getRuntimeCopy } from "@/shared/lib/language";
import {
  AUTH_MIN_PASSWORD_LENGTH,
  AUTH_STORAGE_VERSION,
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
import { logError } from "@/shared/lib/error-logger";
import { startOfflineRegistrationSync } from "@/shared/lib/offline-registration-sync";

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Backend API URL.
 * - Empty / not set → uses relative URLs (works with Vite proxy in dev, same-origin in prod)
 * - Explicit URL     → uses that URL directly
 * Set VITE_DISABLE_BACKEND=true to force local-only mode.
 */
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

const isBackendEnabled = import.meta.env.VITE_DISABLE_BACKEND !== "true";

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

function toSnapshot(
  state: Pick<AuthProviderState, "users" | "session" | "legacyMigrated">
) {
  return {
    version: AUTH_STORAGE_VERSION,
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

  // Start offline registration sync — when connectivity is restored,
  // register the offline user on the backend and upload local data.
  useEffect(() => {
    return startOfflineRegistrationSync(
      (nextSnapshot) => {
        console.log(
          "[AuthProvider] Offline sync completed — updating session."
        );
        setState(createProviderState(nextSnapshot));
      },
      (errorMessage) => {
        console.error("[AuthProvider] Offline sync error:", errorMessage);
        window.alert(errorMessage);
      }
    );
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

      // Try backend auth if enabled
      if (isBackendEnabled) {
        try {
          const client = new AuthClient({ baseUrl: API_BASE_URL });
          const response = await client.login({
            email: normalizedEmail,
            password
          });

          let user = findAuthUserByEmail(state.users, normalizedEmail);

          // Create local user record if not exists (for offline fallback)
          if (user == null) {
            const salt = createPasswordSalt();
            const hash = await hashPassword(password, salt);
            user = createLocalAuthUser({
              name: response.user.name,
              email: response.user.email,
              passwordSalt: salt,
              passwordHash: hash
            });
            const nextUsers = [...state.users, user];
            let nextSnapshot: AuthStorageSnapshot = {
              version: AUTH_STORAGE_VERSION,
              users: nextUsers,
              session: createAuthSession(user, response.token),
              legacyMigrated: state.legacyMigrated
            };

            if (!nextSnapshot.legacyMigrated) {
              await migrateLegacyAnonymousData(user.id);
              nextSnapshot = { ...nextSnapshot, legacyMigrated: true };
            }

            commitState(nextSnapshot);
          } else {
            const session = createAuthSession(user, response.token);
            commitState({
              version: AUTH_STORAGE_VERSION,
              users: state.users,
              session,
              legacyMigrated: state.legacyMigrated
            });
          }
          return;
        } catch (err) {
          // HTTP client errors (401, 409, etc.) should be shown to the user
          if (err instanceof AuthHttpError && err.isClientError) {
            throw err;
          }
          // Network errors — fall through to local auth
          logError(err, { action: "signIn.backend" });
        }
      }

      // Local-only auth
      const user = findAuthUserByEmail(state.users, normalizedEmail);
      if (user == null || !(await verifyPassword(password, user))) {
        throw new Error(copy.auth.invalidCredentialsError);
      }

      let nextSnapshot: AuthStorageSnapshot = {
        version: AUTH_STORAGE_VERSION,
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
    async (
      name: string,
      email: string,
      password: string,
      confirmPassword: string
    ) => {
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

      // Try backend registration if enabled
      if (isBackendEnabled) {
        try {
          const client = new AuthClient({ baseUrl: API_BASE_URL });
          const response = await client.register({
            name,
            email: normalizedEmail,
            password
          });

          // Store local record with password hash for offline fallback
          const passwordSalt = createPasswordSalt();
          const passwordHash = await hashPassword(password, passwordSalt);
          const user = createLocalAuthUser({
            name: response.user.name,
            email: response.user.email,
            passwordSalt,
            passwordHash
          });

          const nextUsers = [...state.users, user];
          let nextSnapshot: AuthStorageSnapshot = {
            version: AUTH_STORAGE_VERSION,
            users: nextUsers,
            session: createAuthSession(user, response.token),
            legacyMigrated: state.legacyMigrated
          };

          if (!nextSnapshot.legacyMigrated) {
            await migrateLegacyAnonymousData(user.id);
            nextSnapshot = { ...nextSnapshot, legacyMigrated: true };
          }

          commitState(nextSnapshot);
          return;
        } catch (err) {
          // HTTP client errors (409 duplicate, etc.) should be shown to the user
          if (err instanceof AuthHttpError && err.isClientError) {
            throw err;
          }
          // Network errors — fall through to local registration
          logError(err, { action: "signUp.backend" });
        }
      }

      // Local-only registration — save pendingPassword for deferred backend sync
      const passwordSalt = createPasswordSalt();
      const passwordHash = await hashPassword(password, passwordSalt);
      const user = createLocalAuthUser({
        name,
        email: normalizedEmail,
        passwordSalt,
        passwordHash,
        pendingPassword: password
      });
      const nextUsers = [...state.users, user];
      let nextSnapshot: AuthStorageSnapshot = {
        version: AUTH_STORAGE_VERSION,
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
