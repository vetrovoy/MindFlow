import { getRuntimeCopy } from "@/shared/lib/language";
import {
  buildTodayFeed,
  getProjectProgress,
  type Project,
  type Task
} from "@mindflow/domain";
import type { RepositoryBundle } from "@mindflow/data";

import { getTodayDateKey } from "@/shared/lib/date";
import type {
  AppDerivedState,
  AppState
} from "./task-store.types";

export const INITIAL_STATE: AppState = {
  tasks: [],
  projects: [],
  isHydrated: false,
  isSaving: false,
  error: null,
  selectedInboxTaskIds: [],
  editingTaskId: null,
  editingProjectId: null,
  toast: null
};

export function sortProjects(projects: Project[]) {
  return [...projects].sort((left, right) => {
    if (left.isFavorite !== right.isFavorite) {
      return left.isFavorite ? -1 : 1;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
}

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "todo" ? -1 : 1;
    }

    const orderResult = left.orderIndex - right.orderIndex;
    if (orderResult !== 0) {
      return orderResult;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
}

export function getVisibleTasks(tasks: Task[], projects: Project[]) {
  const archivedProjectIds = new Set(
    projects.filter((project) => project.archivedAt != null).map((project) => project.id)
  );

  return tasks.filter((task) => {
    if (task.archivedAt != null) {
      return false;
    }

    return task.projectId == null || !archivedProjectIds.has(task.projectId);
  });
}

export function getNextOrderIndex(
  tasks: Task[],
  projectId: string | null,
  excludingTaskId?: string
) {
  const matching = tasks.filter(
    (task) => task.projectId === projectId && task.id !== excludingTaskId && task.archivedAt == null
  );

  if (matching.length === 0) {
    return 0;
  }

  return Math.max(...matching.map((task) => task.orderIndex)) + 1;
}

export function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return getRuntimeCopy().common.unexpectedLocalDataError;
}

export async function readSnapshot(repository: RepositoryBundle) {
  const [tasks, projects] = await Promise.all([
    repository.tasks.listAll(),
    repository.projects.listAll()
  ]);

  return { tasks, projects };
}

export function computeDerived(state: AppState): AppDerivedState {
  const visibleTasks = getVisibleTasks(state.tasks, state.projects);
  const activeProjects = sortProjects(
    state.projects.filter((project) => project.archivedAt == null)
  );
  const inboxTasks = sortTasks(
    visibleTasks.filter((task) => task.projectId == null)
  );
  const todayFeed = buildTodayFeed(visibleTasks, getTodayDateKey());
  const projectSections = activeProjects.map((project) => ({
    project,
    tasks: sortTasks(visibleTasks.filter((task) => task.projectId === project.id)),
    progress: getProjectProgress(visibleTasks, project.id)
  }));

  return {
    inboxTasks,
    todayFeed,
    favoriteProjects: activeProjects.filter((project) => project.isFavorite),
    regularProjects: activeProjects.filter((project) => !project.isFavorite),
    projectSections,
    editingTask: state.tasks.find((task) => task.id === state.editingTaskId) ?? null,
    editingProject: state.projects.find((project) => project.id === state.editingProjectId) ?? null
  };
}
