/**
 * Offline Registration Sync (Mobile)
 *
 * When a user registers while offline, their account exists only locally (SQLite/MMKV).
 * This module detects when connectivity is restored and:
 * 1. Registers the user on the backend (using saved pendingPassword)
 * 2. Gets a JWT token
 * 3. Uploads all local data (tasks, projects) to the server
 * 4. Updates the local session with the JWT
 * 5. Clears pendingPassword from storage
 */

import { AuthClient, AuthHttpError } from '@mindflow/data';
import { createSqliteRepositoryBundle } from '@mindflow/data/sqlite';

import {
  AUTH_STORAGE_VERSION,
  createAuthSession,
  persistAuthSnapshot,
  readAuthSnapshot,
  type AuthStorageSnapshot,
  type LocalAuthUser,
} from './auth';
import { onConnectivityChange, isOnlineNow } from './connectivity';
import { logError } from './error-logger';
import { API_BASE_URL } from '@shared/config';

// ─── State ───────────────────────────────────────────────────────────────────

const MAX_SYNC_ATTEMPTS = 3;

let cleanup: (() => void) | null = null;
let isSyncing = false;
let syncAttempts = 0;
let permanentlyFailed = false;

/**
 * Callback so the auth store can update React state
 * after we patch the persisted snapshot.
 */
type SessionUpdateCallback = (snapshot: AuthStorageSnapshot) => void;
type ErrorCallback = (message: string) => void;
let onSessionUpdated: SessionUpdateCallback | null = null;
let onSyncError: ErrorCallback | null = null;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Starts listening for connectivity changes.
 * Call once at app startup (e.g., in auth store init).
 */
export function startOfflineRegistrationSync(
  callback?: SessionUpdateCallback,
  errorCallback?: ErrorCallback,
): () => void {
  if (API_BASE_URL == null) {
    return () => {};
  }

  // Clean up previous instance
  cleanup?.();

  onSessionUpdated = callback ?? null;
  onSyncError = errorCallback ?? null;
  syncAttempts = 0;
  permanentlyFailed = false;

  // Try immediately if already online
  if (isOnlineNow()) {
    void attemptSync();
  }

  // Listen for future reconnects
  cleanup = onConnectivityChange(event => {
    if (event === 'online') {
      void attemptSync();
    }
  });

  return () => {
    cleanup?.();
    cleanup = null;
    onSessionUpdated = null;
    onSyncError = null;
  };
}

// ─── Core sync logic ─────────────────────────────────────────────────────────

async function attemptSync(): Promise<void> {
  if (isSyncing || permanentlyFailed) return;
  if (API_BASE_URL == null) return;
  if (syncAttempts >= MAX_SYNC_ATTEMPTS) {
    console.warn(
      `[OfflineSync] Max attempts (${MAX_SYNC_ATTEMPTS}) reached — giving up.`,
    );
    permanentlyFailed = true;
    onSyncError?.(
      'Offline sync failed after multiple attempts. Your local data has not been uploaded to the server.',
    );
    return;
  }

  // Exponential backoff: 0s, 2s, 4s
  if (syncAttempts > 0) {
    const delay = 2000 * syncAttempts;
    console.log(
      `[OfflineSync] Backing off ${delay}ms before attempt ${syncAttempts + 1}...`,
    );
    await new Promise(r => setTimeout(r, delay));
  }

  isSyncing = true;
  syncAttempts++;

  try {
    const snapshot = readAuthSnapshot();
    const { session, users } = snapshot;

    // Nothing to do if not logged in or already has a token
    if (session == null || session.accessToken != null) return;

    // Find the local user for this session
    const user = users.find(u => u.id === session.userId);
    if (user == null) return;

    // Need pendingPassword to register on backend
    if (!user.pendingPassword) {
      console.log(
        '[OfflineSync] User has no token but also no pendingPassword — cannot sync.',
      );
      return;
    }

    console.log(
      `[OfflineSync] Attempting deferred registration for ${user.email}...`,
    );

    // 1. Register on backend (or login if already exists)
    const client = new AuthClient({ baseUrl: API_BASE_URL });
    let token: string;

    try {
      const response = await client.register({
        name: user.name,
        email: user.email,
        password: user.pendingPassword,
      });
      token = response.token;
      console.log('[OfflineSync] Backend registration successful.');
    } catch (err) {
      // If email already registered (409), try logging in instead
      if (err instanceof AuthHttpError && err.isConflict) {
        console.log('[OfflineSync] Email already registered — trying login...');
        try {
          const loginResponse = await client.login({
            email: user.email,
            password: user.pendingPassword,
          });
          token = loginResponse.token;
          console.log('[OfflineSync] Backend login successful.');
        } catch {
          // Login failed — email exists but wrong password.
          // This is permanent — stop retrying.
          permanentlyFailed = true;
          const msg =
            `Email ${user.email} is already registered to another user. ` +
            `Your local data cannot be synced to the server.`;
          console.error(`[OfflineSync] ${msg}`);
          onSyncError?.(msg);
          throw new Error(msg);
        }
      } else {
        throw err;
      }
    }

    // 2. Upload local data to server
    await uploadLocalData(user, token);

    // 3. Update local session with JWT and clear pendingPassword
    const updatedUsers = users.map(u =>
      u.id === user.id ? clearPendingPassword(u) : u,
    );

    const nextSnapshot: AuthStorageSnapshot = {
      version: AUTH_STORAGE_VERSION,
      users: updatedUsers,
      session: createAuthSession(user, token),
    };

    persistAuthSnapshot(nextSnapshot);
    console.log('[OfflineSync] Session updated with JWT token.');

    // 4. Notify auth store to re-render
    onSessionUpdated?.(nextSnapshot);
  } catch (err) {
    // Network errors are expected — will retry on next reconnect
    if (err instanceof AuthHttpError && err.isClientError) {
      logError(err, { action: 'offlineSync.clientError' });
    } else {
      logError(err, { action: 'offlineSync.networkError' });
    }
    console.error('[OfflineSync] Sync failed:', err);
  } finally {
    isSyncing = false;
  }
}

// ─── Data upload ─────────────────────────────────────────────────────────────

/**
 * Uploads all local data to the server.
 * Throws if any upload fails — caller should NOT upgrade session on partial failure.
 */
async function uploadLocalData(
  user: LocalAuthUser,
  token: string,
): Promise<void> {
  if (API_BASE_URL == null) return;

  const dbName = `mindflow-${user.id}`;
  const localRepo = await createSqliteRepositoryBundle({ name: dbName });

  const [tasks, projects] = await Promise.all([
    localRepo.tasks.listAll(),
    localRepo.projects.listAll(),
  ]);

  if (tasks.length === 0 && projects.length === 0) {
    console.log('[OfflineSync] No local data to upload.');
    return;
  }

  console.log(
    `[OfflineSync] Uploading ${projects.length} projects and ${tasks.length} tasks...`,
  );

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const baseUrl = (API_BASE_URL ?? '').replace(/\/+$/, '');
  let failedCount = 0;

  // Upload projects first (tasks may reference them via projectId)
  for (const project of projects) {
    try {
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        failedCount++;
        logError(new Error(`HTTP ${res.status}`), {
          action: 'offlineSync.uploadProject',
          entityId: project.id,
        });
      }
    } catch (err) {
      failedCount++;
      logError(err, {
        action: 'offlineSync.uploadProject',
        entityId: project.id,
      });
    }
  }

  for (const task of tasks) {
    try {
      const res = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(task),
      });
      if (!res.ok) {
        failedCount++;
        logError(new Error(`HTTP ${res.status}`), {
          action: 'offlineSync.uploadTask',
          entityId: task.id,
        });
      }
    } catch (err) {
      failedCount++;
      logError(err, {
        action: 'offlineSync.uploadTask',
        entityId: task.id,
      });
    }
  }

  if (failedCount > 0) {
    const total = tasks.length + projects.length;
    throw new Error(
      `[OfflineSync] ${failedCount}/${total} items failed to upload. ` +
        `Session will NOT be upgraded — will retry on next reconnect.`,
    );
  }

  console.log('[OfflineSync] Data upload complete.');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clearPendingPassword(user: LocalAuthUser): LocalAuthUser {
  const { pendingPassword: _, ...rest } = user;
  return rest;
}
