import {
  createDexieRepositoryBundle,
  type RepositoryBundle
} from "@mindflow/data";
import { startTransition } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";

import type { Project, Task } from "@mindflow/domain";
import {
  computeDerived,
  formatError,
  getVisibleTasks,
  INITIAL_STATE,
  readSnapshot,
  sortTasks
} from "./task-store.helpers";
import { createAppActions } from "./task-store.actions";
import { withRetry } from "../lib/retry";
import { logError } from "../lib/error-logger";
import { SyncManager } from "../lib/sync-manager";
import { resetSyncStore } from "./sync-store";
import type { AppState, AppStore, ToastState } from "./task-store.types";

export type AppStoreApi = StoreApi<AppStore & { syncManager?: SyncManager }>;

interface CreateAppStoreOptions {
  repositoryFactory?: (input: { name: string }) => RepositoryBundle;
  repository?: RepositoryBundle;
}

let storeEntry: {
  store: AppStoreApi;
  syncManager?: SyncManager;
} | null = null;

export function createAppStore(
  databaseName: string,
  options: CreateAppStoreOptions = {}
): AppStoreApi {
  const repository =
    options.repository ??
    (options.repositoryFactory ?? createDexieRepositoryBundle)({
      name: databaseName
    });

  const isApiBundle = options.repository != null;

  const store = createStore<AppStore & { syncManager?: SyncManager }>(
    (set, get) => {
      let toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

      const patchState = (patch: Partial<AppState>) => {
        set((s) => {
          const nextState = { ...s.state, ...patch };

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
            selectedInboxTaskIds: currentState.selectedInboxTaskIds.filter(
              (taskId) => visibleInboxIds.has(taskId)
            ),
            editingTaskId:
              currentState.editingTaskId != null &&
              snapshot.tasks.some(
                (task) => task.id === currentState.editingTaskId
              )
                ? currentState.editingTaskId
                : null,
            editingProjectId:
              currentState.editingProjectId != null &&
              snapshot.projects.some(
                (project) => project.id === currentState.editingProjectId
              )
                ? currentState.editingProjectId
                : null,
            isHydrated: true
          });
        });
      };

      const runMutation = async (work: () => Promise<void>) => {
        patchState({ isSaving: true, error: null });

        try {
          await withRetry(() => repository.transaction.run(work), {
            onRetry: (attempt, error) => {
              logError(error, {
                action: "runMutation.retry",
                metadata: { attempt }
              });
            }
          });
          await applySnapshot();
          return true;
        } catch (nextError) {
          logError(nextError, { action: "runMutation" });
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
          setToast
        })
      };
    }
  );

  // Start sync for API bundles
  if (isApiBundle) {
    const onSyncComplete = ({
      tasks,
      projects
    }: {
      tasks: Task[];
      projects: Project[];
    }) => {
      console.log("[AppStore] Sync complete:", tasks.length, "tasks");
      store.setState((s) => {
        const nextState = { ...s.state, tasks, projects, isHydrated: true };
        return { state: nextState, derived: computeDerived(nextState) };
      });
    };

    const syncManager = new SyncManager(repository, onSyncComplete);
    syncManager.start();

    storeEntry = { store, syncManager };
  } else {
    storeEntry = { store };
  }

  return store;
}

export function getAppStore(): AppStoreApi | null {
  return storeEntry?.store ?? null;
}

export function resetAppStore(): void {
  storeEntry?.syncManager?.stop();
  resetSyncStore();
  storeEntry = null;
}
