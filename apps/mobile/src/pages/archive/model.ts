import type { Project, Task } from '@mindflow/domain';

export interface ArchivePageState {
  archivedTasks: Task[];
  archivedProjects: Project[];
  projectById: Map<string, Project>;
  taskCountByProjectId: Map<string, number>;
  isEmpty: boolean;
}

export function buildArchivePageState(input: {
  tasks: Task[];
  projects: Project[];
}): ArchivePageState {
  const { projects, tasks } = input;
  const projectById = new Map(projects.map(project => [project.id, project]));
  const taskCountByProjectId = new Map<string, number>();

  for (const task of tasks) {
    if (task.projectId != null) {
      taskCountByProjectId.set(
        task.projectId,
        (taskCountByProjectId.get(task.projectId) ?? 0) + 1,
      );
    }
  }

  const archivedTasks = tasks
    .filter(task => task.archivedAt != null)
    .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''));

  const archivedProjects = projects
    .filter(project => project.archivedAt != null)
    .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? ''));

  return {
    archivedTasks,
    archivedProjects,
    projectById,
    taskCountByProjectId,
    isEmpty: archivedTasks.length === 0 && archivedProjects.length === 0,
  };
}
