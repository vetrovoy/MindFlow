import { createStore, type StoreApi } from 'zustand/vanilla';

import { createSqliteRepositoryBundle } from '../data/sqlite';
import {
  computeDerived,
  formatError,
  INITIAL_STATE,
  readSnapshot,
} from './task-store.helpers';
import { createAppActions } from './task-store.actions';
import type { AppState, AppStore, ToastState } from './task-store.types';

export type AppStoreApi = StoreApi<AppStore>;

let storeInstance: AppStoreApi | null = null;

export function createMobileAppStore(): AppStoreApi {
  const repository = createSqliteRepositoryBundle({ name: 'mindflow' });

  return createStore<AppStore>((set, get) => {
    let toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const patchState = (patch: Partial<AppState>) => {
      set(store => {
        const nextState = { ...store.state, ...patch };
        return { state: nextState, derived: computeDerived(nextState) };
      });
    };

    const setToast = (toast: ToastState | null) => {
      if (toastTimeoutId != null) {
        clearTimeout(toastTimeoutId);
        toastTimeoutId = null;
      }
      patchState({ toast });
      if (toast == null) {
        return;
      }
      toastTimeoutId = setTimeout(() => {
        patchState({ toast: null });
        toastTimeoutId = null;
      }, 2600);
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
      state: INITIAL_STATE,
      derived: computeDerived(INITIAL_STATE),
      actions: createAppActions({
        repository,
        getStore: get,
        patchState,
        runMutation,
        applySnapshot,
        setToast,
      }),
    };
  });
}

export function getMobileAppStore(): AppStoreApi {
  if (storeInstance == null) {
    storeInstance = createMobileAppStore();
  }
  return storeInstance;
}
