import { createStore, type StoreApi } from 'zustand/vanilla';

import { createSqliteRepositoryBundle } from '@mindflow/data/sqlite';
import { computeDerived, formatError, INITIAL_STATE, readSnapshot } from './selectors';
import { createAppActions } from './actions';
import { resolveInitialLanguage } from '@shared/lib/language';
import type { AppState, AppStore } from './types';

export type AppStoreApi = StoreApi<AppStore>;

let storeInstance: AppStoreApi | null = null;

export function createMobileAppStore(): AppStoreApi {
  const repository = createSqliteRepositoryBundle({ name: 'mindflow' });
  const initialLanguage = resolveInitialLanguage();
  const initialState: AppState = { ...INITIAL_STATE, language: initialLanguage };

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
        await repository.transaction.run(work);
        await applySnapshot();
        return true;
      } catch (nextError) {
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

export function getMobileAppStore(): AppStoreApi {
  if (storeInstance == null) {
    storeInstance = createMobileAppStore();
  }
  return storeInstance;
}
