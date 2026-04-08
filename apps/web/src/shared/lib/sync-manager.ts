import type { Project, Task } from "@mindflow/domain";
import type { RepositoryBundle } from "@mindflow/data";
import { onConnectivityChange, isOnlineNow } from "./browser-connectivity";
import { logError } from "./error-logger";
import { getSyncStore } from "../model/sync-store";

export type SyncCallback = (data: {
  tasks: Task[];
  projects: Project[];
}) => void;

export class SyncManager {
  private repository: RepositoryBundle;
  private onSyncComplete: SyncCallback;
  private cleanup: (() => void) | null = null;

  constructor(repository: RepositoryBundle, onSyncComplete: SyncCallback) {
    this.repository = repository;
    this.onSyncComplete = onSyncComplete;
  }

  /**
   * Starts the sync loop:
   * 1. Pulls data immediately.
   * 2. Listens for connectivity changes to pull on reconnect.
   */
  start(): void {
    console.log("[SyncManager] Starting sync...");
    this.performPull();
    this.setupConnectivityListener();
  }

  stop(): void {
    this.cleanup?.();
    this.cleanup = null;
    console.log("[SyncManager] Sync stopped.");
  }

  /**
   * Triggers a manual pull (useful for manual refresh).
   */
  async pull(): Promise<void> {
    await this.performPull();
  }

  /**
   * Triggers a manual push (no-op for API-based repos where writes are direct).
   */
  async push(): Promise<void> {
    console.log("[SyncManager] Push triggered (no-op for API mode).");
  }

  private async performPull(): Promise<void> {
    if (!isOnlineNow()) {
      console.log("[SyncManager] Skipping pull: offline.");
      return;
    }

    const syncStore = getSyncStore();
    syncStore.getState().setSyncing();

    try {
      const data = await this.repository.sync.pull();
      if (data) {
        this.onSyncComplete(data);
        syncStore.getState().setSynced();
        console.log(
          `[SyncManager] Pull successful: ${data.tasks.length} tasks.`
        );
      } else {
        syncStore.getState().setSynced();
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      logError(error, { action: "sync.pull" });
      syncStore.getState().setError(msg);
      console.error("[SyncManager] Pull failed:", msg);
    }
  }

  private setupConnectivityListener(): void {
    this.cleanup = onConnectivityChange((event) => {
      console.log(`[SyncManager] Connectivity changed: ${event}`);
      if (event === "online") {
        void this.performPull();
      }
    });
  }
}
