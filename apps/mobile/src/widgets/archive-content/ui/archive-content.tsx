import { StyleSheet, View } from 'react-native';

import type { Project, Task } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { StateCard } from '@shared/ui/primitives';

import { ArchiveProjectGroup } from './archive-project-group';
import { ArchiveTaskGroup } from './archive-task-group';

interface ArchiveContentProps {
  isEmpty: boolean;
  tasks: Task[];
  projects: Project[];
  projectById: Map<string, Project>;
  taskCountByProjectId: Map<string, number>;
  onRestoreTask: (taskId: string) => void;
  onRestoreProject: (projectId: string) => void;
}

const styles = StyleSheet.create({
  groups: {
    gap: 24,
  },
});

export function ArchiveContent({
  isEmpty,
  tasks,
  projects,
  projectById,
  taskCountByProjectId,
  onRestoreTask,
  onRestoreProject,
}: ArchiveContentProps) {
  const copy = useCopy();

  if (isEmpty) {
    return (
      <StateCard
        variant="empty"
        title={copy.archive.emptyTitle}
        description={copy.archive.emptyDescription}
      />
    );
  }

  return (
    <View style={styles.groups}>
      {tasks.length > 0 ? (
        <ArchiveTaskGroup
          onRestore={onRestoreTask}
          projectById={projectById}
          tasks={tasks}
        />
      ) : null}
      {projects.length > 0 ? (
        <ArchiveProjectGroup
          onRestore={onRestoreProject}
          projects={projects}
          taskCountByProjectId={taskCountByProjectId}
        />
      ) : null}
    </View>
  );
}
