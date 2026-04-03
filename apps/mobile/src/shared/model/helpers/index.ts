import type { Project, Task } from '@mindflow/domain';
import type { RepositoryBundle } from '@mindflow/data';
import type { AppState } from '../types';

/**
 * Начальное состояние приложения
 */
export const INITIAL_STATE: AppState = {
  tasks: [],
  projects: [],
  isHydrated: false,
  isSaving: false,
  error: null,
  editingTaskId: null,
  editingProjectId: null,
  isTaskCreateOpen: false,
  taskCreatePreferredDate: null,
  isProjectCreateOpen: false,
};

/**
 * Форматирование ошибки в строку
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Неизвестная ошибка';
}

/**
 * Чтение снимка данных из SQLite
 */
export async function readSnapshot(
  repository: RepositoryBundle,
): Promise<{ tasks: Task[]; projects: Project[] }> {
  const [tasks, projects] = await Promise.all([
    repository.tasks.listAll(),
    repository.projects.listAll(),
  ]);
  return { tasks, projects };
}
