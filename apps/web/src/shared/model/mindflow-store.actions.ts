import {
  archiveProject as archiveProjectEntity,
  archiveTask as archiveTaskEntity,
  bulkMoveToProject,
  createProject as createProjectEntity,
  createTask,
  reorderTasks,
  setTaskStatus,
  toggleTaskDone,
  updateProject,
  updateTask,
  validateProject,
  validateTask,
  type Project
} from "@mindflow/domain";
import type { RepositoryBundle } from "@mindflow/data";

import { getNowIso } from "@/shared/lib/date";
import { createId } from "@/shared/lib/ids";
import { getRuntimeCopy } from "@/shared/lib/language";
import { getProjectDecoration, getProjectDecorationByColor } from "@/shared/lib/projects";
import {
  getNextOrderIndex,
  formatError
} from "./mindflow-store.helpers";
import type {
  MindFlowActions,
  MindFlowState,
  MindFlowStore,
  ToastState
} from "./mindflow-store.types";

interface CreateMindFlowActionsParams {
  repository: RepositoryBundle;
  getStore: () => MindFlowStore;
  patchState: (patch: Partial<MindFlowState>) => void;
  runMutation: (work: () => Promise<void>) => Promise<boolean>;
  applySnapshot: () => Promise<void>;
  setToast: (toast: ToastState | null) => void;
}

export function createMindFlowActions({
  applySnapshot,
  getStore,
  patchState,
  repository,
  runMutation,
  setToast
}: CreateMindFlowActionsParams): MindFlowActions {
  return {
    async reload() {
      try {
        await applySnapshot();
      } catch (nextError) {
        patchState({
          error: formatError(nextError),
          isHydrated: true
        });
      }
    },
    async addInboxTask(input) {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) {
        return false;
      }

      const { tasks } = getStore().state;
      const now = getNowIso();
      const baseTask = createTask({
        id: createId(),
        title: trimmedTitle,
        dueDate: input.dueDate ?? null,
        projectId: input.projectId ?? null,
        priority: input.priority ?? "medium",
        now,
        orderIndex: getNextOrderIndex(tasks, input.projectId ?? null)
      });
      const nextTask =
        input.status != null && input.status !== "todo"
          ? setTaskStatus(baseTask, input.status, now)
          : baseTask;

      const saved = await runMutation(async () => {
        await repository.tasks.save(nextTask);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        setToast({
          title: copy.task.addedToastTitle,
          description: copy.task.addedToastDescription
        });
      }

      return saved;
    },
    async toggleTask(taskId) {
      const { tasks } = getStore().state;
      const task = tasks.find((item) => item.id === taskId);
      if (task == null) {
        return;
      }

      await runMutation(async () => {
        await repository.tasks.save(toggleTaskDone(task, getNowIso()));
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
    async saveTaskEdit(input, options = {}) {
      const { closeOnSuccess = true, toastOnSuccess = true } = options;
      const { tasks } = getStore().state;
      const task = tasks.find((item) => item.id === input.taskId);
      if (task == null) {
        return false;
      }

      const nextProjectId = input.projectId;
      const now = getNowIso();
      let nextTask = updateTask(
        task,
        {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          projectId: nextProjectId
        },
        now
      );

      if (task.projectId !== nextProjectId) {
        nextTask = validateTask({
          ...nextTask,
          orderIndex: getNextOrderIndex(tasks, nextProjectId, task.id)
        });
      }

      if (nextTask.status !== input.status) {
        nextTask = setTaskStatus(nextTask, input.status, now);
      }

      const saved = await runMutation(async () => {
        await repository.tasks.save(nextTask);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        if (closeOnSuccess) {
          patchState({ editingTaskId: null });
        }

        if (toastOnSuccess) {
          setToast({
            title: copy.task.updatedToastTitle,
            description: copy.task.updatedToastDescription
          });
        }
      }

      return saved;
    },
    async saveProjectEdit(input, options = {}) {
      const { closeOnSuccess = true, toastOnSuccess = true } = options;
      const { projects } = getStore().state;
      const project = projects.find((item) => item.id === input.projectId);
      if (project == null) {
        return false;
      }

      const nextProject = updateProject(
        project,
        {
          name: input.name,
          color: input.color,
          isFavorite: input.isFavorite,
          deadline: input.deadline
        },
        getNowIso()
      );

      const saved = await runMutation(async () => {
        await repository.projects.save(nextProject);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        if (closeOnSuccess) {
          patchState({ editingProjectId: null });
        }

        if (toastOnSuccess) {
          setToast({
            title: copy.project.updatedToastTitle,
            description: copy.project.updatedToastDescription
          });
        }
      }

      return saved;
    },
    async archiveTask(taskId) {
      const { tasks } = getStore().state;
      const task = tasks.find((item) => item.id === taskId);
      if (task == null) {
        return;
      }

      const saved = await runMutation(async () => {
        await repository.tasks.save(archiveTaskEntity(task, getNowIso()));
      });

      if (saved) {
        const copy = getRuntimeCopy();
        patchState({ editingTaskId: null });
        setToast({
          title: copy.task.archivedToastTitle,
          description: copy.task.archivedToastDescription
        });
      }
    },
    async archiveProject(projectId) {
      const { projects } = getStore().state;
      const project = projects.find((item) => item.id === projectId);
      if (project == null) {
        return;
      }

      const saved = await runMutation(async () => {
        await repository.projects.save(archiveProjectEntity(project, getNowIso()));
      });

      if (saved) {
        const copy = getRuntimeCopy();
        patchState({ editingProjectId: null });
        setToast({
          title: copy.project.archivedToastTitle,
          description: copy.project.archivedToastDescription
        });
      }
    },
    async deleteTask(taskId) {
      const { tasks } = getStore().state;
      const task = tasks.find((item) => item.id === taskId);
      if (task == null) {
        return;
      }

      const saved = await runMutation(async () => {
        await repository.tasks.delete(taskId);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        patchState({ editingTaskId: null });
        setToast({
          title: copy.task.deletedToastTitle,
          description: copy.task.deletedToastDescription
        });
      }
    },
    toggleInboxSelection(taskId) {
      const { selectedInboxTaskIds } = getStore().state;

      patchState({
        selectedInboxTaskIds: selectedInboxTaskIds.includes(taskId)
          ? selectedInboxTaskIds.filter((currentTaskId) => currentTaskId !== taskId)
          : [...selectedInboxTaskIds, taskId]
      });
    },
    clearInboxSelection() {
      patchState({ selectedInboxTaskIds: [] });
    },
    async moveSelectedInboxTasks(input) {
      const {
        state: { tasks, projects, selectedInboxTaskIds },
        derived: { inboxTasks }
      } = getStore();
      const orderedSelection = inboxTasks
        .filter((task) => selectedInboxTaskIds.includes(task.id))
        .map((task) => task.id);

      if (orderedSelection.length === 0) {
        return false;
      }

      let targetProjectId = input.projectId?.trim() || undefined;
      const now = getNowIso();
      let nextProject: Project | null = null;

      if (targetProjectId == null) {
        const trimmedName = input.projectName?.trim();
        if (!trimmedName) {
          return false;
        }

        const decoration = getProjectDecoration(projects.length);
        nextProject = createProjectEntity({
          id: createId(),
          name: trimmedName,
          color: decoration.color,
          emoji: decoration.emoji,
          now
        });
        targetProjectId = nextProject.id;
      }

      const selectedTasks = tasks.filter((task) => orderedSelection.includes(task.id));
      const movedTasks = bulkMoveToProject(selectedTasks, orderedSelection, targetProjectId, now);

      const saved = await runMutation(async () => {
        if (nextProject != null) {
          await repository.projects.save(validateProject(nextProject));
        }

        await repository.tasks.saveMany(movedTasks);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        patchState({ selectedInboxTaskIds: [] });
        setToast({
          title: copy.messages.movedTasksTitle,
          description:
            nextProject == null
              ? copy.messages.movedTasksDescriptionExistingProject
              : copy.messages.movedTasksDescriptionCreatedProject
        });
      }

      return saved;
    },
    async reorderProjectTasks(projectId, orderedTaskIds) {
      const { tasks } = getStore().state;
      const projectTasks = tasks.filter(
        (task) => task.projectId === projectId && task.archivedAt == null
      );

      if (projectTasks.length <= 1) {
        return false;
      }

      const reorderedTasks = reorderTasks(projectTasks, orderedTaskIds, getNowIso());
      const saved = await runMutation(async () => {
        await repository.tasks.saveMany(reorderedTasks);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        setToast({
          title: copy.taskReorder.saved,
          description: copy.taskReorder.description
        });
      }

      return saved;
    },
    async createProject(input) {
      const trimmedName = input.name.trim();
      if (!trimmedName) {
        return false;
      }

      const { projects } = getStore().state;
      const now = getNowIso();
      const decoration = getProjectDecoration(projects.length);
      const resolvedDecoration = input.color
        ? getProjectDecorationByColor(input.color)
        : decoration;
      const nextProject = createProjectEntity({
        id: createId(),
        name: trimmedName,
        color: input.color ?? resolvedDecoration.color,
        deadline: input.deadline ?? null,
        emoji: resolvedDecoration.emoji,
        now
      });

      const saved = await runMutation(async () => {
        await repository.projects.save(nextProject);
      });

      if (saved) {
        const copy = getRuntimeCopy();
        setToast({
          title: copy.project.createdToastTitle,
          description: copy.project.createdToastDescription
        });
      }

      return saved;
    },
    dismissToast() {
      setToast(null);
    },
    clearError() {
      patchState({ error: null });
    }
  };
}
