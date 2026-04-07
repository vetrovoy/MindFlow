import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useCopy } from '@shared/lib/use-copy';
import {
  CollapsibleSection,
  StateCard,
  TodayTaskCard,
} from '@shared/ui/primitives';
import type { AppStore } from '@shared/model/types';

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
    gap: 14,
  },
  sectionContent: {
    gap: 10,
  },
});

type TodayFeedItem = AppStore['derived']['todayFeed'][number];

interface TodayTaskFeedProps {
  overdueTasks: AppStore['derived']['todayFeed'];
  todayTasks: AppStore['derived']['todayFeed'];
  onOpenTask: (taskId: string) => void;
  onToggleDone: (taskId: string) => void;
}

export const TodayTaskFeed = memo(function TodayTaskFeed({
  overdueTasks,
  todayTasks,
  onOpenTask,
  onToggleDone,
}: TodayTaskFeedProps) {
  const copy = useCopy();
  const hasTodayFeed = overdueTasks.length > 0 || todayTasks.length > 0;

  function renderTodayTaskCard(item: TodayFeedItem) {
    return (
      <TodayTaskCard
        key={`${item.bucket}-${item.task.id}`}
        item={item}
        onOpenTask={onOpenTask}
        onToggleDone={onToggleDone}
      />
    );
  }

  if (!hasTodayFeed) {
    return (
      <View testID="today-main-card">
        <StateCard
          variant="empty"
          title={copy.today.emptyTitle}
          description={copy.today.emptyDescription}
        />
      </View>
    );
  }

  if (overdueTasks.length > 0) {
    return (
      <View style={styles.content} testID="today-main-card">
        <CollapsibleSection
          count={overdueTasks.length}
          defaultOpen
          title={copy.today.overdueTitle}
        >
          <View style={styles.sectionContent}>
            {overdueTasks.map(renderTodayTaskCard)}
          </View>
        </CollapsibleSection>
        {todayTasks.length > 0 ? (
          <CollapsibleSection
            count={todayTasks.length}
            defaultOpen
            title={copy.today.sectionTitle}
          >
            <View style={styles.sectionContent}>
              {todayTasks.map(renderTodayTaskCard)}
            </View>
          </CollapsibleSection>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.sectionContent} testID="today-main-card">
      {todayTasks.map(renderTodayTaskCard)}
    </View>
  );
});
