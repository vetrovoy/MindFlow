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

import { getNowIso } from '@shared/lib/date';
import { createId } from '@shared/lib/ids';
import { getNextOrderIndex, formatError } from './task-store.helpers';
import type { AppActions, AppState, AppStore, ToastState } from './task-store.types';

const copy = getCopy('ru');

interface CreateAppActionsParams {
  repository: RepositoryBundle;
  getStore: () => AppStore;
  patchState: (patch: Partial<AppState>) => void;
  runMutation: (work: () => Promise<void>) => Promise<boolean>;
  applySnapshot: () => Promise<void>;
  setToast: (toast: ToastState | null) => void;
}

export function createAppActions({
  repository,
  getStore,
  patchState,
  runMutation,
  applySnapshot,
  setToast,
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
        return;
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
        setToast({ message: copy.task.addedToastTitle, variant: 'success' });
      }
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

    async saveTaskEdit(input) {
      const { tasks } = getStore().state;
      const task = tasks.find(t => t.id === input.taskId);
      if (task == null) {
        return;
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
        patchState({ editingTaskId: null });
        setToast({ message: copy.task.updatedToastTitle, variant: 'success' });
      }
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
        setToast({ message: copy.project.createdToastTitle, variant: 'success' });
      }
    },

    async saveProjectEdit(input) {
      const { projects } = getStore().state;
      const project = projects.find(p => p.id === input.projectId);
      if (project == null) {
        return;
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
        patchState({ editingProjectId: null });
        setToast({ message: copy.project.updatedToastTitle, variant: 'success' });
      }
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
    dismissToast() {
      setToast(null);
    },
    clearError() {
      patchState({ error: null });
    },
  };
}
