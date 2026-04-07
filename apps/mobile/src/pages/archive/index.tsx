import { useMemo } from 'react';
import { ScrollView } from 'react-native';

import { useCopy } from '@shared/lib/use-copy';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';

import { ArchiveContent } from '@widgets/archive-content/ui/archive-content';

import { buildArchivePageState } from './model';

export function ArchivePage() {
  const copy = useCopy();
  const actions = useMobileAppStore(s => s.actions);
  const state = useMobileAppStore(s => s.state);

  const viewModel = useMemo(
    () =>
      buildArchivePageState({
        tasks: state.tasks,
        projects: state.projects,
      }),
    [state.projects, state.tasks],
  );

  return (
    <ScreenShell title={copy.archive.title}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        <ArchiveContent
          isEmpty={viewModel.isEmpty}
          tasks={viewModel.archivedTasks}
          projects={viewModel.archivedProjects}
          projectById={viewModel.projectById}
          taskCountByProjectId={viewModel.taskCountByProjectId}
          onRestoreTask={actions.restoreTask}
          onRestoreProject={actions.restoreProject}
        />
      </ScrollView>
    </ScreenShell>
  );
}
