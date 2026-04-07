import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Task } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { CollapsibleSection, StateCard, TaskRow } from '@shared/ui/primitives';

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  sectionContent: {
    gap: 10,
  },
});

interface InboxContentProps {
  activeInboxTasks: Task[];
  completedInboxTasks: Task[];
  badgeByTaskId: Partial<Record<string, 'today' | 'overdue'>>;
  onOpenTask: (taskId: string) => void;
  onToggleDone: (taskId: string) => void;
}

export const InboxContent = memo(function InboxContent({
  activeInboxTasks,
  completedInboxTasks,
  badgeByTaskId,
  onOpenTask,
  onToggleDone,
}: InboxContentProps) {
  const copy = useCopy();
  const hasInboxContent =
    activeInboxTasks.length > 0 || completedInboxTasks.length > 0;

  function renderTaskRow(task: Task) {
    return (
      <TaskRow
        key={task.id}
        presentation="inbox"
        task={task}
        badgeVariant={badgeByTaskId[task.id]}
        onOpenTask={onOpenTask}
        onToggleDone={onToggleDone}
      />
    );
  }

  if (!hasInboxContent) {
    return (
      <StateCard
        variant="empty"
        title={copy.inbox.emptyTitle}
        description={copy.inbox.emptyDescription}
      />
    );
  }

  return (
    <View style={styles.content}>
      {activeInboxTasks.length > 0 ? (
        <View style={styles.sectionContent}>
          {activeInboxTasks.map(renderTaskRow)}
        </View>
      ) : null}
      {completedInboxTasks.length > 0 ? (
        <CollapsibleSection
          count={completedInboxTasks.length}
          defaultOpen={activeInboxTasks.length === 0}
          title={copy.inbox.completedTitle}
        >
          <View style={styles.sectionContent}>
            {completedInboxTasks.map(renderTaskRow)}
          </View>
        </CollapsibleSection>
      ) : null}
    </View>
  );
});
