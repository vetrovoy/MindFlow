import { createStore, type StoreApi } from 'zustand/vanilla';

import type { RepositoryBundle } from '@mindflow/data';
import { createSqliteRepositoryBundle } from '@mindflow/data/sqlite';
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
import type { AppState, AppStore } from './types';

export type AppStoreApi = StoreApi<AppStore>;

interface StoreEntry {
  store: AppStoreApi;
  userId: string;
}

let storeEntry: StoreEntry | null = null;

export function createMobileAppStore(
  userId: string,
  repository?: RepositoryBundle,
): AppStoreApi {
  const repo =
    repository ?? createSqliteRepositoryBundle({ name: `mindflow-${userId}` });
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
      const snapshot = await readSnapshot(repo);
      patchState({
        tasks: snapshot.tasks,
        projects: snapshot.projects,
        isHydrated: true,
      });
    };

    const runMutation = async (work: () => Promise<void>): Promise<boolean> => {
      patchState({ isSaving: true, error: null });
      try {
        await withRetry(() => repo.transaction.run(work), {
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
        patchState({ error: formatError(nextError) });
        return false;
      } finally {
        patchState({ isSaving: false });
      }
    };

    return {
      state: initialState,
      derived: computeDerived(initialState),
      actions: createAppActions({
        repository: repo,
        getStore: get,
        patchState,
        runMutation,
        applySnapshot,
      }),
    };
  });

  return store;
}

export function getMobileAppStore(
  userId: string,
  repository?: RepositoryBundle,
): AppStoreApi {
  if (storeEntry != null) {
    if (storeEntry.userId === userId) return storeEntry.store;
    // Different userId or new repository → reset cache
    resetMobileAppStore();
  }
  const store = createMobileAppStore(userId, repository);
  storeEntry = { store, userId };
  return store;
}

export function resetMobileAppStore(): void {
  storeEntry = null;
}
