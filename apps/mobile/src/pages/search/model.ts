import { searchEntities, type Project, type Task } from '@mindflow/domain';

import type { ProjectSection } from '@shared/model/types';
import {
  sortProjects,
  sortTasks,
} from '@shared/model/selectors/task.selectors';

export type SearchSortOption = 'relevance' | 'date';

export interface SearchPageState {
  tasks: Task[];
  projects: Project[];
  sectionsById: Map<string, ProjectSection>;
  isIdle: boolean;
  isEmpty: boolean;
}

export function buildSearchPageState(input: {
  query: string;
  sortBy: SearchSortOption;
  tasks: Task[];
  projects: Project[];
  projectSections: ProjectSection[];
}): SearchPageState {
  const { projectSections, projects, query, sortBy, tasks } = input;
  const searchResults = searchEntities(tasks, projects, query);
  const sortedTasks = sortTasks(searchResults.tasks);
  const sortedProjects = sortProjects(searchResults.projects);

  if (sortBy === 'date') {
    sortedTasks.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  const normalizedQuery = query.trim();
  const hasResults = sortedTasks.length > 0 || sortedProjects.length > 0;

  return {
    tasks: sortedTasks,
    projects: sortedProjects,
    sectionsById: new Map(
      projectSections.map(section => [section.project.id, section]),
    ),
    isIdle: normalizedQuery.length === 0,
    isEmpty: normalizedQuery.length > 0 && !hasResults,
  };
}
