import type { Project, Task } from '@mindflow/domain';
import { isProjectArchived, isTaskArchived } from '@mindflow/domain';

/**
 * Селектор: фильтрует архивные задачи и задачи из архивных проектов
 */
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

/**
 * Селектор: сортировка задач по статусу, orderIndex и createdAt
 */
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

/**
 * Селектор: сортировка проектов (избранные первыми, затем по createdAt)
 */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });
}

/**
 * Селектор: следующий orderIndex для новой задачи в проекте
 */
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

/**
 * Селектор: ключ сегодняшней даты (YYYY-MM-DD)
 */
export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
