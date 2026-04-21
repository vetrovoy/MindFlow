import type { Project, Task } from '@mindflow/domain';
import type { RepositoryBundle } from '@mindflow/data';
import { onConnectivityChange, isOnlineNow } from '@shared/lib/connectivity';
import { logError } from '@shared/lib/error-logger';
import { getSyncStore } from '@shared/model/sync-store';

export type SyncCallback = (data: {
  tasks: Task[];
  projects: Project[];
}) => void;

export class SyncManager {
  private repository: RepositoryBundle;
  private onSyncComplete: SyncCallback;
  private cleanup: (() => void) | null = null;
  private skipInitialPull: boolean;
  private isSyncing = false;
  private stopped = false;

  constructor(
    repository: RepositoryBundle,
    onSyncComplete: SyncCallback,
    skipInitialPull = false,
  ) {
    this.repository = repository;
    this.onSyncComplete = onSyncComplete;
    this.skipInitialPull = skipInitialPull;
  }

  /**
   * Starts the sync loop:
   * - For SQLite bundles: pulls data immediately + listens for reconnect.
   * - For API bundles: only listens for reconnect (data already loaded via applySnapshot).
   */
  start(): void {
    console.log('[SyncManager] Starting sync...');
    this.stopped = false;
    this.setupConnectivityListener();

    // For API bundles, skip initial pull — applySnapshot already loads data
    if (!this.skipInitialPull) {
      void this.performPull();
    }
  }

  stop(): void {
    this.stopped = true;
    this.cleanup?.();
    this.cleanup = null;
    console.log('[SyncManager] Sync stopped.');
  }

  /**
   * Triggers a manual pull (useful for pull-to-refresh).
   */
  async pull(): Promise<void> {
    await this.performPull();
  }

  private async performPull(): Promise<void> {
    if (this.stopped || this.isSyncing || !isOnlineNow()) {
      return;
    }

    this.isSyncing = true;
    const syncStore = getSyncStore();
    syncStore.getState().setSyncing();

    try {
      const data = await this.repository.sync.pull();

      // Check if stopped during async pull — discard stale result
      if (this.stopped) {
        console.log('[SyncManager] Discarding pull result — manager stopped.');
        return;
      }

      if (data) {
        this.onSyncComplete(data);
        syncStore.getState().setSynced();
        console.log(
          `[SyncManager] Pull successful: ${data.tasks.length} tasks.`,
        );
      } else {
        syncStore.getState().setSynced();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      logError(error, { action: 'sync.pull' });
      syncStore.getState().setError(msg);
      console.error('[SyncManager] Pull failed:', msg);
    } finally {
      this.isSyncing = false;
    }
  }

  private setupConnectivityListener(): void {
    this.cleanup = onConnectivityChange(event => {
      console.log(`[SyncManager] Connectivity changed: ${event}`);
      if (event === 'online') {
        void this.performPull();
      }
    });
  }
}
