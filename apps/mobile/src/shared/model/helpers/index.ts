import type { Project, Task } from '@mindflow/domain';
import type { RepositoryBundle } from '@mindflow/data';
import type { AppState, ToastState } from '../types';

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
  toast: null,
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

/**
 * Отложенная установка toast с авто-снятием
 */
export function scheduleToast(
  setToast: (t: ToastState | null) => void,
  toast: ToastState,
  durationMs = 2600,
): ReturnType<typeof setTimeout> {
  setToast(toast);
  return setTimeout(() => setToast(null), durationMs);
}
