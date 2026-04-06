import { StyleSheet, View } from 'react-native';

import type { Project, Task } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { Body, Meta } from '@shared/ui/typography';
import { ArchivedTaskRow } from '../archived-task-row';

interface ArchiveTaskGroupProps {
  tasks: Task[];
  projectById: Map<string, Project>;
  onRestore: (taskId: string) => void;
}

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rows: {
    gap: 4,
    marginTop: 8,
  },
});

export function ArchiveTaskGroup({
  tasks,
  projectById,
  onRestore,
}: ArchiveTaskGroupProps) {
  const copy = useCopy();

  return (
    <View>
      <View style={styles.groupHeader}>
        <Meta tone="primary">{copy.archive.tasksTitle}</Meta>
        <Body tone="secondary">{tasks.length}</Body>
      </View>
      <View style={styles.rows}>
        {tasks.map(task => (
          <ArchivedTaskRow
            key={task.id}
            project={
              task.projectId != null
                ? (projectById.get(task.projectId) ?? null)
                : null
            }
            task={task}
            onRestore={onRestore}
          />
        ))}
      </View>
    </View>
  );
}
