import {
  buildTodayFeed,
  getProjectProgress,
  isProjectArchived,
  isTaskArchived,
} from '@mindflow/domain';
import type { Project, Task } from '@mindflow/domain';
import type { RepositoryBundle } from '@mindflow/data';
import type { AppDerived, AppState, ProjectSection, ToastState } from './task-store.types';

export const INITIAL_STATE: AppState = {
  tasks: [],
  projects: [],
  isHydrated: false,
  isSaving: false,
  error: null,
  editingTaskId: null,
  editingProjectId: null,
  toast: null,
};

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'todo' ? -1 : 1;
    }
    if (a.orderIndex !== b.orderIndex) {
      return a.orderIndex - b.orderIndex;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function getVisibleTasks(tasks: Task[], projects: Project[]): Task[] {
  const archivedProjectIds = new Set(
    projects.filter(isProjectArchived).map(p => p.id),
  );
  return tasks.filter(
    t =>
      !isTaskArchived(t) &&
      (t.projectId == null || !archivedProjectIds.has(t.projectId)),
  );
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getNextOrderIndex(
  tasks: Task[],
  projectId: string | null,
): number {
  const relevant = tasks.filter(
    t => t.projectId === projectId && !isTaskArchived(t),
  );
  if (relevant.length === 0) {
    return 0;
  }
  return Math.max(...relevant.map(t => t.orderIndex)) + 1;
}

export function computeDerived(state: AppState): AppDerived {
  const visibleTasks = getVisibleTasks(state.tasks, state.projects);
  const activeProjects = state.projects.filter(p => !isProjectArchived(p));
  const sortedProjects = sortProjects(activeProjects);

  const inboxTasks = sortTasks(
    visibleTasks.filter(t => t.projectId == null),
  );

  const todayFeed = buildTodayFeed(visibleTasks, getTodayKey());

  const favoriteProjects = sortedProjects.filter(p => p.isFavorite);
  const regularProjects = sortedProjects.filter(p => !p.isFavorite);

  const projectSections: ProjectSection[] = sortedProjects.map(project => ({
    project,
    tasks: sortTasks(visibleTasks.filter(t => t.projectId === project.id)),
    progress: getProjectProgress(state.tasks, project.id),
  }));

  const editingTask = state.editingTaskId
    ? (state.tasks.find(t => t.id === state.editingTaskId) ?? null)
    : null;

  const editingProject = state.editingProjectId
    ? (state.projects.find(p => p.id === state.editingProjectId) ?? null)
    : null;

  return {
    inboxTasks,
    todayFeed,
    favoriteProjects,
    regularProjects,
    projectSections,
    editingTask,
    editingProject,
  };
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Неизвестная ошибка';
}

export async function readSnapshot(
  repository: RepositoryBundle,
): Promise<{ tasks: Task[]; projects: Project[] }> {
  const [tasks, projects] = await Promise.all([
    repository.tasks.listAll(),
    repository.projects.listAll(),
  ]);
  return { tasks, projects };
}

export function scheduleToast(
  setToast: (t: ToastState | null) => void,
  toast: ToastState,
  durationMs = 2600,
): ReturnType<typeof setTimeout> {
  setToast(toast);
  return setTimeout(() => setToast(null), durationMs);
}
