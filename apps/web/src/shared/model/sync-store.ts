import { createStore, type StoreApi } from "zustand/vanilla";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: Date | null;
  error: string | null;
}

interface SyncActions {
  setSyncing: () => void;
  setSynced: () => void;
  setError: (error: string) => void;
}

export type SyncStore = StoreApi<SyncState & SyncActions>;

function createSyncStore(): SyncStore {
  return createStore<SyncState & SyncActions>((set) => ({
    status: "idle",
    lastSyncedAt: null,
    error: null,
    setSyncing: () => set({ status: "syncing", error: null }),
    setSynced: () =>
      set({ status: "synced", lastSyncedAt: new Date(), error: null }),
    setError: (error) => set({ status: "error", error })
  }));
}

let store: SyncStore | null = null;

export function getSyncStore(): SyncStore {
  if (!store) {
    store = createSyncStore();
  }
  return store;
}

export function resetSyncStore(): void {
  store = null;
}
