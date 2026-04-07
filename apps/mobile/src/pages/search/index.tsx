import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import { useCopy } from '@shared/lib/use-copy';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';

import { SearchContent } from '@widgets/search-content/ui/search-content';

import { buildSearchPageState, type SearchSortOption } from './model';
import { SearchField } from './ui/search-field';
import { SearchSortControl } from './ui/search-sort-control';

export function SearchPage() {
  const copy = useCopy();
  const actions = useMobileAppStore(s => s.actions);
  const derived = useMobileAppStore(s => s.derived);
  const state = useMobileAppStore(s => s.state);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');

  const viewModel = useMemo(
    () =>
      buildSearchPageState({
        query,
        sortBy,
        tasks: state.tasks,
        projects: state.projects,
        projectSections: derived.projectSections,
      }),
    [derived.projectSections, query, sortBy, state.projects, state.tasks],
  );

  const titleAccessory = !viewModel.isIdle ? (
    <SearchSortControl sortBy={sortBy} onSortChange={setSortBy} />
  ) : undefined;

  return (
    <ScreenShell accessory={titleAccessory} title={copy.search.title}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        <SearchField value={query} onChange={setQuery} />
        <SearchContent
          isIdle={viewModel.isIdle}
          isEmpty={viewModel.isEmpty}
          tasks={viewModel.tasks}
          projects={viewModel.projects}
          sectionsById={viewModel.sectionsById}
          onToggleDone={actions.toggleTask}
          onOpenTask={actions.openTaskEdit}
          onOpenProject={actions.openProjectEdit}
        />
      </ScrollView>
    </ScreenShell>
  );
}
