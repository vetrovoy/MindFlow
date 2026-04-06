import { useMemo, useState } from 'react';

import { searchEntities } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { sortProjects, sortTasks } from '@shared/model/selectors/task.selectors';
import { ScreenShell } from '@shared/ui/primitives';
import { SearchSortControl, type SearchSortOption } from './search-sort-control';
import { SearchField } from './search-field';
import { SearchResultsContent } from './search-results-content';

export function SearchPage() {
  const copy = useCopy();
  const actions = useMobileAppStore(s => s.actions);
  const derived = useMobileAppStore(s => s.derived);
  const state = useMobileAppStore(s => s.state);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');

  const results = useMemo(() => {
    const nextResults = searchEntities(state.tasks, state.projects, query);
    const sortedTasks = sortTasks(nextResults.tasks);
    const sortedProjects = sortProjects(nextResults.projects);

    if (sortBy === 'date') {
      sortedTasks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return {
      tasks: sortedTasks,
      projects: sortedProjects,
    };
  }, [query, state.projects, state.tasks, sortBy]);

  const projectSectionsById = useMemo(
    () => new Map(derived.projectSections.map(section => [section.project.id, section])),
    [derived.projectSections],
  );

  const normalizedQuery = query.trim();
  const hasResults = results.tasks.length > 0 || results.projects.length > 0;
  const isIdle = normalizedQuery.length === 0;
  const isEmpty = !hasResults && !isIdle;

  const titleAccessory = !isIdle
    ? <SearchSortControl sortBy={sortBy} onSortChange={setSortBy} />
    : undefined;

  return (
    <ScreenShell
      accessory={titleAccessory}
      title={copy.search.title}
    >
      <SearchField value={query} onChange={setQuery} />
      <SearchResultsContent
        isIdle={isIdle}
        isEmpty={isEmpty}
        tasks={results.tasks}
        projects={results.projects}
        sectionsById={projectSectionsById}
        onToggleDone={actions.toggleTask}
        onOpenTask={actions.openTaskEdit}
        onOpenProject={actions.openProjectEdit}
      />
    </ScreenShell>
  );
}
