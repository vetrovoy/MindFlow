import {
  createProject as createProjectEntity,
  createTask,
  reorderTasks,
  toggleTaskDone,
  updateProject,
  updateTask,
  validateProject,
  validateTask,
} from '@mindflow/domain';
import type { RepositoryBundle } from '@mindflow/data';
import { getCopy } from '@mindflow/copy';
import Toast from 'react-native-toast-message';

import { getNowIso } from '@shared/lib/date';
import { createId } from '@shared/lib/ids';
import { setStoredLanguage, persistLanguage } from '@shared/lib/language';
import { getNextOrderIndex } from '../selectors';
import { formatError } from '../helpers';
import type { AppActions, AppState, AppStore } from '../types';
import type { AppLanguage } from '@mindflow/copy';

function getRuntimeCopy(getStore: () => AppStore) {
  return getCopy(getStore().state.language);
}

function setToast(getStore: () => AppStore, message: string, variant: 'success' | 'error' | 'info') {
  Toast.show({
    type: variant,
    text1: message,
  });
}

interface CreateAppActionsParams {
  repository: RepositoryBundle;
  getStore: () => AppStore;
  patchState: (patch: Partial<AppState>) => void;
  runMutation: (work: () => Promise<void>) => Promise<boolean>;
  applySnapshot: () => Promise<void>;
}

export function createAppActions({
  repository,
  getStore,
  patchState,
  runMutation,
  applySnapshot,
}: CreateAppActionsParams): AppActions {
  return {
    async reload() {
      try {
        await applySnapshot();
      } catch (nextError) {
        patchState({ error: formatError(nextError), isHydrated: true });
      }
    },

    async addInboxTask(input) {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) {
        return false;
      }

      const { tasks } = getStore().state;
      const now = getNowIso();
      const task = createTask({
        id: createId(),
        title: trimmedTitle,
        dueDate: input.dueDate ?? null,
        projectId: null,
        priority: 'medium',
        now,
        orderIndex: getNextOrderIndex(tasks, null),
      });

      const saved = await runMutation(async () => {
        await repository.tasks.save(task);
      });

      if (saved) {
        const copy = getRuntimeCopy(getStore);
        setToast(getStore, copy.task.addedToastTitle, 'success');
      }

      return saved;
    },

    async toggleTask(taskId) {
      const { tasks } = getStore().state;
      const task = tasks.find(t => t.id === taskId);
      if (task == null) {
        return;
      }
      await runMutation(async () => {
        await repository.tasks.save(toggleTaskDone(task, getNowIso()));
      });
    },

    async saveTaskEdit(input, options = {}) {
      const { closeOnSuccess = true, toastOnSuccess = true } = options;
      const { tasks } = getStore().state;
      const task = tasks.find(t => t.id === input.taskId);
      if (task == null) {
        return false;
      }

      const now = getNowIso();
      let nextTask = updateTask(
        task,
        {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          projectId: input.projectId,
        },
        now,
      );

      if (task.projectId !== input.projectId) {
        nextTask = validateTask({
          ...nextTask,
          orderIndex: getNextOrderIndex(tasks, input.projectId ?? null),
        });
      }

      const saved = await runMutation(async () => {
        await repository.tasks.save(nextTask);
      });

      if (saved) {
        if (closeOnSuccess) {
          patchState({ editingTaskId: null });
        }
        if (toastOnSuccess) {
          const copy = getRuntimeCopy(getStore);
          setToast(getStore, copy.task.updatedToastTitle, 'success');
        }
      }

      return saved;
    },

    async createProject(input) {
      const trimmedName = input.name.trim();
      if (!trimmedName) {
        return;
      }

      const now = getNowIso();
      const project = createProjectEntity({
        id: createId(),
        name: trimmedName,
        color: input.color,
        emoji: input.emoji,
        deadline: input.deadline ?? null,
        isFavorite: input.isFavorite ?? false,
        now,
      });

      const saved = await runMutation(async () => {
        await repository.projects.save(project);
      });

      if (saved) {
        const copy = getRuntimeCopy(getStore);
        setToast(getStore, copy.project.createdToastTitle, 'success');
      }
    },

    async saveProjectEdit(input, options = {}) {
      const { closeOnSuccess = true, toastOnSuccess = true } = options;
      const { projects } = getStore().state;
      const project = projects.find(p => p.id === input.projectId);
      if (project == null) {
        return false;
      }

      const now = getNowIso();
      const base = updateProject(
        project,
        {
          name: input.name,
          color: input.color,
          isFavorite: input.isFavorite,
          deadline: input.deadline,
        },
        now,
      );
      const nextProject =
        input.emoji != null
          ? validateProject({ ...base, emoji: input.emoji })
          : base;

      const saved = await runMutation(async () => {
        await repository.projects.save(nextProject);
      });

      if (saved) {
        if (closeOnSuccess) {
          patchState({ editingProjectId: null });
        }
        if (toastOnSuccess) {
          const copy = getRuntimeCopy(getStore);
          setToast(getStore, copy.project.updatedToastTitle, 'success');
        }
      }

      return saved;
    },

    async reorderProjectTasks(projectId, orderedTaskIds) {
      const { tasks } = getStore().state;
      const projectTasks = tasks.filter(
        t => t.projectId === projectId && t.archivedAt == null,
      );

      if (projectTasks.length <= 1) {
        return;
      }

      const reordered = reorderTasks(projectTasks, orderedTaskIds, getNowIso());
      await runMutation(async () => {
        await repository.tasks.saveMany(reordered);
      });
    },

    openTaskEdit(taskId) {
      patchState({ editingTaskId: taskId });
    },
    closeTaskEdit() {
      patchState({ editingTaskId: null });
    },
    openProjectEdit(projectId) {
      patchState({ editingProjectId: projectId });
    },
    closeProjectEdit() {
      patchState({ editingProjectId: null });
    },
    openTaskCreate(preferredDate) {
      patchState({ isTaskCreateOpen: true, taskCreatePreferredDate: preferredDate ?? null });
    },
    closeTaskCreate() {
      patchState({ isTaskCreateOpen: false, taskCreatePreferredDate: null });
    },
    openProjectCreate() {
      patchState({ isProjectCreateOpen: true });
    },
    closeProjectCreate() {
      patchState({ isProjectCreateOpen: false });
    },
    async createProjectFromSheet(input) {
      const trimmedName = input.name.trim();
      if (!trimmedName) return;

      const now = getNowIso();
      const project = createProjectEntity({
        id: createId(),
        name: trimmedName,
        color: input.color,
        emoji: '',
        isFavorite: input.isFavorite ?? false,
        deadline: input.deadline ?? null,
        now,
      });

      const saved = await runMutation(async () => {
        await repository.projects.save(project);
      });

      if (saved) {
        patchState({ isProjectCreateOpen: false });
        const copy = getRuntimeCopy(getStore);
        setToast(getStore, copy.project.createdToastTitle, 'success');
      }
    },
    async createTask(input) {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) return;

      const { tasks } = getStore().state;
      const now = getNowIso();
      const task = createTask({
        id: createId(),
        title: trimmedTitle,
        dueDate: input.dueDate ?? null,
        projectId: input.projectId ?? null,
        priority: input.priority ?? 'medium',
        now,
        orderIndex: getNextOrderIndex(tasks, input.projectId ?? null),
      });

      const saved = await runMutation(async () => {
        await repository.tasks.save(task);
      });

      if (saved) {
        patchState({ isTaskCreateOpen: false, taskCreatePreferredDate: null });
        const copy = getRuntimeCopy(getStore);
        setToast(getStore, copy.task.addedToastTitle, 'success');
      }
    },
    dismissToast() {
      Toast.hide();
    },
    clearError() {
      patchState({ error: null });
    },
    setLanguage(lang: AppLanguage) {
      setStoredLanguage(lang);
      persistLanguage(lang);
      patchState({ language: lang });
    },
  };
}
