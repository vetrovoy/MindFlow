/**
 * Sync store — placeholder for future cloud synchronisation.
 *
 * Currently all data lives in local SQLite (offline-first).
 * SyncPort.push / pull in the repository are no-ops.
 * This module provides types and an initial state that future
 * sync implementation can build on.
 */

export type SyncStatus = 'idle' | 'syncing' | 'error';

export interface SyncState {
  /** Current sync status. */
  status: SyncStatus;
  /** ISO timestamp of the last successful sync, or null if never synced. */
  lastSyncAt: string | null;
  /** Number of local changes not yet pushed to the server. */
  pendingChanges: number;
  /** Error message from the last failed sync attempt. */
  lastError: string | null;
}

export const INITIAL_SYNC_STATE: SyncState = {
  status: 'idle',
  lastSyncAt: null,
  pendingChanges: 0,
  lastError: null,
};
