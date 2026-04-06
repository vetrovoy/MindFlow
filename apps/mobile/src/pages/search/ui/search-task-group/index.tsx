import { StyleSheet, View } from 'react-native';

import type { Task } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { TaskRow } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

interface SearchTaskGroupProps {
  tasks: Task[];
  onToggleDone: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
}

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskList: {
    gap: 8,
    marginTop: 8,
  },
});

export function SearchTaskGroup({
  tasks,
  onToggleDone,
  onOpenTask,
}: SearchTaskGroupProps) {
  const copy = useCopy();

  return (
    <View>
      <View style={styles.groupHeader}>
        <Meta tone="primary">{copy.search.tasksTitle}</Meta>
        <Body tone="secondary">{tasks.length}</Body>
      </View>
      <View style={styles.taskList}>
        {tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            onToggleDone={onToggleDone}
            onOpenTask={onOpenTask}
            presentation="inbox"
          />
        ))}
      </View>
    </View>
  );
}
