import { useMemo } from 'react';
import { ScrollView } from 'react-native';

import { useCopy } from '@shared/lib/use-copy';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';
import { ArchiveResultsContent } from './ui/archive-results-content';

export function ArchivePage() {
  const copy = useCopy();
  const actions = useMobileAppStore(s => s.actions);
  const state = useMobileAppStore(s => s.state);

  const projectById = useMemo(
    () => new Map(state.projects.map(project => [project.id, project])),
    [state.projects],
  );

  const taskCountByProjectId = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of state.tasks) {
      if (task.projectId != null) {
        counts.set(task.projectId, (counts.get(task.projectId) ?? 0) + 1);
      }
    }
    return counts;
  }, [state.tasks]);

  const archivedTasks = useMemo(
    () =>
      state.tasks
        .filter(task => task.archivedAt != null)
        .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? '')),
    [state.tasks],
  );

  const archivedProjects = useMemo(
    () =>
      state.projects
        .filter(project => project.archivedAt != null)
        .sort((a, b) => (b.archivedAt ?? '').localeCompare(a.archivedAt ?? '')),
    [state.projects],
  );

  const isEmpty = archivedTasks.length === 0 && archivedProjects.length === 0;

  return (
    <ScreenShell title={copy.archive.title}>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <ArchiveResultsContent
          isEmpty={isEmpty}
          tasks={archivedTasks}
          projects={archivedProjects}
          projectById={projectById}
          taskCountByProjectId={taskCountByProjectId}
          onRestoreTask={actions.restoreTask}
          onRestoreProject={actions.restoreProject}
        />
      </ScrollView>
    </ScreenShell>
  );
}
