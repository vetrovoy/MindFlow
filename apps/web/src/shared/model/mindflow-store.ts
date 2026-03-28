import { createDexieRepositoryBundle } from "@mindflow/data";
import { startTransition } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";

import {
  computeDerived,
  formatError,
  getVisibleTasks,
  INITIAL_STATE,
  readSnapshot,
  sortTasks
} from "./mindflow-store.helpers";
import { createMindFlowActions } from "./mindflow-store.actions";
import type {
  MindFlowState,
  MindFlowStore,
  ToastState
} from "./mindflow-store.types";

export type MindFlowStoreApi = StoreApi<MindFlowStore>;

export function createMindFlowStore(databaseName: string): MindFlowStoreApi {
  const repository = createDexieRepositoryBundle({ name: databaseName });

  return createStore<MindFlowStore>((set, get) => {
    let toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const patchState = (patch: Partial<MindFlowState>) => {
      set((store) => {
        const nextState = { ...store.state, ...patch };

        return {
          state: nextState,
          derived: computeDerived(nextState)
        };
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
      const currentState = get().state;
      const visibleInboxIds = new Set(
        sortTasks(
          getVisibleTasks(snapshot.tasks, snapshot.projects).filter(
            (task) => task.projectId == null
          )
        ).map((task) => task.id)
      );

      startTransition(() => {
        patchState({
          tasks: snapshot.tasks,
          projects: snapshot.projects,
          selectedInboxTaskIds: currentState.selectedInboxTaskIds.filter((taskId) =>
            visibleInboxIds.has(taskId)
          ),
          editingTaskId:
            currentState.editingTaskId != null &&
            snapshot.tasks.some((task) => task.id === currentState.editingTaskId)
              ? currentState.editingTaskId
              : null,
          editingProjectId:
            currentState.editingProjectId != null &&
            snapshot.projects.some((project) => project.id === currentState.editingProjectId)
              ? currentState.editingProjectId
              : null,
          isHydrated: true
        });
      });
    };

    const runMutation = async (work: () => Promise<void>) => {
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
      actions: createMindFlowActions({
        repository,
        getStore: get,
        patchState,
        runMutation,
        applySnapshot,
        setToast
      })
    };
  });
}
