import type { Project, Task, TodayTaskGroup } from '@mindflow/domain';
import { buildTodayFeed, getProjectProgress } from '@mindflow/domain';

import type { AppDerived, AppState, ProjectSection } from '../types';
import { getVisibleTasks, sortProjects, sortTasks, getTodayKey } from './task.selectors';

/**
 * Селектор: входящие задачи (без проекта)
 */
export function getInboxTasks(state: AppState): Task[] {
  const visibleTasks = getVisibleTasks(state.tasks, state.projects);
  return sortTasks(visibleTasks.filter(t => t.projectId == null));
}

/**
 * Селектор: лента Today (просроченные + сегодня + высокоприоритетные)
 */
export function getTodayFeed(state: AppState): TodayTaskGroup[] {
  const visibleTasks = getVisibleTasks(state.tasks, state.projects);
  return buildTodayFeed(visibleTasks, getTodayKey());
}

/**
 * Селектор: избранные проекты
 */
export function getFavoriteProjects(state: AppState): Project[] {
  const activeProjects = state.projects.filter(p => p.archivedAt == null);
  return sortProjects(activeProjects).filter(p => p.isFavorite);
}

/**
 * Селектор: обычные проекты (не избранные)
 */
export function getRegularProjects(state: AppState): Project[] {
  const activeProjects = state.projects.filter(p => p.archivedAt == null);
  return sortProjects(activeProjects).filter(p => !p.isFavorite);
}

/**
 * Селектор: секции проектов с задачами и прогрессом
 */
export function getProjectSections(state: AppState): ProjectSection[] {
  const visibleTasks = getVisibleTasks(state.tasks, state.projects);
  const activeProjects = state.projects.filter(p => p.archivedAt == null);
  const sortedProjects = sortProjects(activeProjects);

  return sortedProjects.map(project => ({
    project,
    tasks: sortTasks(visibleTasks.filter(t => t.projectId === project.id)),
    progress: getProjectProgress(state.tasks, project.id),
  }));
}

/**
 * Селектор: редактируемая задача
 */
export function getEditingTask(state: AppState): Task | null {
  return state.editingTaskId
    ? (state.tasks.find(t => t.id === state.editingTaskId) ?? null)
    : null;
}

/**
 * Селектор: редактируемый проект
 */
export function getEditingProject(state: AppState): Project | null {
  return state.editingProjectId
    ? (state.projects.find(p => p.id === state.editingProjectId) ?? null)
    : null;
}

/**
 * Композиционный селектор: все производные данные
 */
export function computeDerived(state: AppState): AppDerived {
  return {
    inboxTasks: getInboxTasks(state),
    todayFeed: getTodayFeed(state),
    favoriteProjects: getFavoriteProjects(state),
    regularProjects: getRegularProjects(state),
    projectSections: getProjectSections(state),
    editingTask: getEditingTask(state),
    editingProject: getEditingProject(state),
  };
}
