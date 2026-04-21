import { getNowIso } from "@/shared/lib/date";
import { createId } from "@/shared/lib/ids";
import {
  safeReadStorage,
  safeWriteStorage
} from "@/shared/lib/browser-storage";

export const LEGACY_AUTH_STORAGE_KEY = "mindflow-auth";
export const APP_AUTH_STORAGE_KEY = "planner-auth";
export const AUTH_MIN_PASSWORD_LENGTH = 8;
export const AUTH_STORAGE_VERSION = 1;
export const AUTH_CRYPTO_UNAVAILABLE_ERROR =
  "Secure password hashing is not available in this environment.";

export interface LocalAuthUser {
  id: string;
  name: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
  /**
   * Stored temporarily when user registers offline.
   * Needed to forward the original password to the backend
   * when connectivity is restored (server uses bcrypt, not SHA-256).
   * Cleared after successful backend registration.
   */
  pendingPassword?: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  /** JWT token from backend — null for local-only auth */
  accessToken: string | null;
}

export interface AuthStorageSnapshot {
  version: number;
  users: LocalAuthUser[];
  session: AuthSession | null;
  legacyMigrated: boolean;
}

function createEmptyAuthSnapshot(): AuthStorageSnapshot {
  return {
    version: AUTH_STORAGE_VERSION,
    users: [],
    session: null,
    legacyMigrated: false
  };
}

function isLocalAuthUser(value: unknown): value is LocalAuthUser {
  if (typeof value !== "object" || value == null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.passwordSalt === "string" &&
    typeof candidate.passwordHash === "string" &&
    typeof candidate.createdAt === "string"
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value == null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    (candidate.accessToken == null || typeof candidate.accessToken === "string")
  );
}

export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidAuthEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeAuthEmail(email));
}

function sanitizeStoredSnapshot(value: unknown): AuthStorageSnapshot {
  if (typeof value !== "object" || value == null) {
    return createEmptyAuthSnapshot();
  }

  const candidate = value as Record<string, unknown>;
  const users = Array.isArray(candidate.users)
    ? candidate.users.filter(isLocalAuthUser).map((user) => ({
        ...user,
        email: normalizeAuthEmail(user.email)
      }))
    : [];
  const usersById = new Map(users.map((user) => [user.id, user]));
  const rawSession = isAuthSession(candidate.session)
    ? candidate.session
    : null;
  const sessionUser =
    rawSession == null ? null : (usersById.get(rawSession.userId) ?? null);

  return {
    version:
      typeof candidate.version === "number" &&
      candidate.version >= AUTH_STORAGE_VERSION
        ? candidate.version
        : AUTH_STORAGE_VERSION,
    users,
    session:
      sessionUser == null
        ? null
        : {
            userId: sessionUser.id,
            name: sessionUser.name,
            email: sessionUser.email,
            accessToken: rawSession?.accessToken ?? null
          },
    legacyMigrated: candidate.legacyMigrated === true
  };
}

export function readStoredAuthSnapshot() {
  if (typeof window === "undefined") {
    return createEmptyAuthSnapshot();
  }

  const raw =
    safeReadStorage(APP_AUTH_STORAGE_KEY) ??
    safeReadStorage(LEGACY_AUTH_STORAGE_KEY);
  if (raw == null) {
    return createEmptyAuthSnapshot();
  }

  try {
    return sanitizeStoredSnapshot(JSON.parse(raw));
  } catch {
    return createEmptyAuthSnapshot();
  }
}

export function persistAuthSnapshot(snapshot: AuthStorageSnapshot) {
  safeWriteStorage(APP_AUTH_STORAGE_KEY, JSON.stringify(snapshot));
}

export function createAuthSession(
  user: LocalAuthUser,
  accessToken: string | null = null
): AuthSession {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    accessToken
  };
}

export function findAuthUserByEmail(users: LocalAuthUser[], email: string) {
  const normalizedEmail = normalizeAuthEmail(email);
  return users.find((user) => user.email === normalizedEmail) ?? null;
}

export function createLocalAuthUser(input: {
  name: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  pendingPassword?: string;
}) {
  const trimmedName = input.name.trim();

  const user: LocalAuthUser = {
    id: createId(),
    name: trimmedName,
    email: normalizeAuthEmail(input.email),
    passwordSalt: input.passwordSalt,
    passwordHash: input.passwordHash,
    createdAt: getNowIso()
  };

  if (input.pendingPassword) {
    user.pendingPassword = input.pendingPassword;
  }

  return user;
}

function getRuntimeCrypto() {
  if (
    typeof crypto === "undefined" ||
    typeof crypto.getRandomValues !== "function" ||
    crypto.subtle == null ||
    typeof crypto.subtle.digest !== "function"
  ) {
    throw new Error(AUTH_CRYPTO_UNAVAILABLE_ERROR);
  }

  return crypto;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function createPasswordSalt() {
  const bytes = new Uint8Array(16);
  getRuntimeCrypto().getRandomValues(bytes);
  return bytesToHex(bytes);
}

export async function hashPassword(password: string, salt: string) {
  const payload = new TextEncoder().encode(`${salt}:${password}`);
  const hashBuffer = await getRuntimeCrypto().subtle.digest("SHA-256", payload);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export async function verifyPassword(
  password: string,
  credentials: Pick<LocalAuthUser, "passwordSalt" | "passwordHash">
) {
  const passwordHash = await hashPassword(password, credentials.passwordSalt);
  return passwordHash === credentials.passwordHash;
}
