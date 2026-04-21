import { createStore, type StoreApi } from 'zustand/vanilla';
import Toast from 'react-native-toast-message';

import type { Project, Task } from '@mindflow/domain';
import type { RepositoryBundle } from '@mindflow/data';
import { createApiRepositoryBundle } from '@mindflow/data';
import { createSqliteRepositoryBundle } from '@mindflow/data/sqlite';
import { readAuthSnapshot } from '@shared/lib/auth';
import { API_BASE_URL } from '@shared/config';
import {
  computeDerived,
  formatError,
  INITIAL_STATE,
  readSnapshot,
} from './selectors';
import { createAppActions } from './actions';
import { resolveInitialLanguage } from '@shared/lib/language';
import { withRetry } from '@shared/lib/retry';
import { logError } from '@shared/lib/error-logger';
import { SyncManager } from '@shared/lib/sync-manager';
import { resetSyncStore } from '@shared/model/sync-store';
import type { AppState, AppStore } from './types';

export type AppStoreApi = StoreApi<AppStore>;

interface StoreEntry {
  store: AppStoreApi;
  userId: string;
  syncManager?: SyncManager;
}

let storeEntry: StoreEntry | null = null;
let storePromise: Promise<AppStoreApi> | null = null;

export function createMobileAppStore(
  userId: string,
  repository: RepositoryBundle,
): AppStoreApi {
  const initialLanguage = resolveInitialLanguage();
  const initialState: AppState = {
    ...INITIAL_STATE,
    language: initialLanguage,
  };

  const store = createStore<AppStore>((set, get) => {
    const patchState = (patch: Partial<AppState>) => {
      set(store => {
        const nextState = { ...store.state, ...patch };
        return { state: nextState, derived: computeDerived(nextState) };
      });
    };

    const applySnapshot = async () => {
      const snapshot = await readSnapshot(repository);
      patchState({
        tasks: snapshot.tasks,
        projects: snapshot.projects,
        isHydrated: true,
      });
    };

    const runMutation = async (work: () => Promise<void>): Promise<boolean> => {
      patchState({ isSaving: true, error: null });
      try {
        await withRetry(() => repository.transaction.run(work), {
          onRetry: (attempt, error) => {
            logError(error, {
              action: 'runMutation.retry',
              metadata: { attempt },
            });
          },
        });
        await applySnapshot();
        return true;
      } catch (nextError) {
        logError(nextError, { action: 'runMutation' });
        const message = formatError(nextError);
        patchState({ error: message });
        Toast.show({ type: 'error', text1: message });
        return false;
      } finally {
        patchState({ isSaving: false });
      }
    };

    return {
      state: initialState,
      derived: computeDerived(initialState),
      actions: createAppActions({
        repository,
        getStore: get,
        patchState,
        runMutation,
        applySnapshot,
      }),
    };
  });

  return store;
}

export async function getMobileAppStore(
  userId: string,
  repository?: RepositoryBundle,
): Promise<AppStoreApi> {
  // Return existing store if available
  if (storeEntry != null && storeEntry.userId === userId) {
    return storeEntry.store;
  }

  // If already being created — wait for existing promise
  if (storePromise != null) {
    return storePromise;
  }

  // Create new store (with lock to prevent race conditions from React Strict Mode)
  storePromise = (async () => {
    const isApiBundle = repository != null;
    let repo: RepositoryBundle;

    if (repository) {
      repo = repository;
    } else {
      const snapshot = readAuthSnapshot();
      const token = snapshot.session?.accessToken ?? null;

      if (token != null && API_BASE_URL != null) {
        repo = createApiRepositoryBundle({ baseUrl: API_BASE_URL, token });
      } else {
        repo = await createSqliteRepositoryBundle({
          name: `mindflow-${userId}`,
        });
      }
    }

    const store = createMobileAppStore(userId, repo);

    const snapshot = readAuthSnapshot();
    const hasToken = snapshot.session?.accessToken ?? null;

    if (isApiBundle || hasToken != null) {
      const onSyncComplete = ({
        tasks,
        projects,
      }: {
        tasks: Task[];
        projects: Project[];
      }) => {
        console.log('[AppStore] Sync complete:', tasks.length, 'tasks');
        store.setState(s => {
          const nextState = { ...s.state, tasks, projects, isHydrated: true };
          return { state: nextState, derived: computeDerived(nextState) };
        });
      };

      const syncManager = new SyncManager(repo, onSyncComplete, isApiBundle);
      syncManager.start();
      storeEntry = { store, userId, syncManager };
    } else {
      storeEntry = { store, userId };
    }

    storePromise = null;
    return store;
  })();

  return storePromise;
}

export function resetMobileAppStore(): void {
  storeEntry?.syncManager?.stop();
  resetSyncStore();
  storePromise = null;
  storeEntry = null;
}
