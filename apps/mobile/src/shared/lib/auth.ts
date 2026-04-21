import { createMMKV } from 'react-native-mmkv';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

import { getNowIso } from './date';
import { createId } from './ids';

// ─── Constants ───────────────────────────────────────────────────────────────

const AUTH_MMKV_ID = 'mindflow-auth';
const AUTH_STORAGE_KEY = 'auth-snapshot';

export const AUTH_MIN_PASSWORD_LENGTH = 8;
export const AUTH_STORAGE_VERSION = 1;

const authStorage = createMMKV({ id: AUTH_MMKV_ID });

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

// ─── Storage ─────────────────────────────────────────────────────────────────

function createEmptySnapshot(): AuthStorageSnapshot {
  return { version: AUTH_STORAGE_VERSION, users: [], session: null };
}

function isLocalAuthUser(value: unknown): value is LocalAuthUser {
  if (typeof value !== 'object' || value == null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.email === 'string' &&
    typeof c.passwordSalt === 'string' &&
    typeof c.passwordHash === 'string' &&
    typeof c.createdAt === 'string'
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value == null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.userId === 'string' &&
    typeof c.name === 'string' &&
    typeof c.email === 'string' &&
    (c.accessToken == null || typeof c.accessToken === 'string')
  );
}

function sanitizeSnapshot(value: unknown): AuthStorageSnapshot {
  if (typeof value !== 'object' || value == null) return createEmptySnapshot();
  const c = value as Record<string, unknown>;

  const users = Array.isArray(c.users)
    ? c.users.filter(isLocalAuthUser).map(u => ({
        ...u,
        email: normalizeEmail(u.email),
      }))
    : [];

  const usersById = new Map(users.map(u => [u.id, u]));
  const rawSession = isAuthSession(c.session) ? c.session : null;
  const sessionUser =
    rawSession == null ? null : (usersById.get(rawSession.userId) ?? null);

  return {
    version: AUTH_STORAGE_VERSION,
    users,
    session:
      sessionUser == null
        ? null
        : {
            userId: sessionUser.id,
            name: sessionUser.name,
            email: sessionUser.email,
            accessToken: rawSession?.accessToken ?? null,
          },
  };
}

export function readAuthSnapshot(): AuthStorageSnapshot {
  try {
    const raw = authStorage.getString(AUTH_STORAGE_KEY);
    console.log('Raw auth snapshot from storage:', raw);
    if (raw == null) return createEmptySnapshot();
    return sanitizeSnapshot(JSON.parse(raw));
  } catch {
    return createEmptySnapshot();
  }
}

export function persistAuthSnapshot(snapshot: AuthStorageSnapshot): void {
  authStorage.set(AUTH_STORAGE_KEY, JSON.stringify(snapshot));
}

// ─── Crypto ───────────────────────────────────────────────────────────────────

export function createPasswordSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bytesToHex(bytes);
}

export function hashPassword(password: string, salt: string): string {
  const payload = new TextEncoder().encode(`${salt}:${password}`);
  return bytesToHex(sha256(payload));
}

export function verifyPassword(
  password: string,
  credentials: Pick<LocalAuthUser, 'passwordSalt' | 'passwordHash'>,
): boolean {
  return (
    hashPassword(password, credentials.passwordSalt) ===
    credentials.passwordHash
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function findUserByEmail(
  users: LocalAuthUser[],
  email: string,
): LocalAuthUser | null {
  return users.find(u => u.email === normalizeEmail(email)) ?? null;
}

export function createLocalAuthUser(input: {
  name: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  pendingPassword?: string;
}): LocalAuthUser {
  const user: LocalAuthUser = {
    id: createId(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordSalt: input.passwordSalt,
    passwordHash: input.passwordHash,
    createdAt: getNowIso(),
  };

  if (input.pendingPassword) {
    user.pendingPassword = input.pendingPassword;
  }

  return user;
}

export function createAuthSession(
  user: LocalAuthUser,
  accessToken: string | null = null,
): AuthSession {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    accessToken,
  };
}
