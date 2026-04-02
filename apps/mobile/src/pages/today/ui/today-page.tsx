import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import {
  CollapsibleSection,
  ScreenShell,
  StateCard,
  SurfaceCard,
  TodayTaskCard,
} from '@shared/ui/primitives';

const copy = getCopy('ru');

const styles = StyleSheet.create({
  contentCard: {
    gap: 14,
  },
  sectionContent: {
    gap: 10,
  },
});

export function TodayPage() {
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const { overdueTasks, todayTasks } = useMemo(() => {
    const overdue: typeof todayFeed = [];
    const today: typeof todayFeed = [];

    for (const item of todayFeed) {
      if (item.bucket === 'overdue') {
        overdue.push(item);
        continue;
      }

      today.push(item);
    }

    return {
      overdueTasks: overdue,
      todayTasks: today,
    };
  }, [todayFeed]);

  const renderTodayTaskCard = (item: (typeof todayFeed)[number]) => (
    <TodayTaskCard key={`${item.bucket}-${item.task.id}`} item={item} onToggleDone={toggleTask} />
  );

  return (
    <>
      <ScreenShell title={copy.today.title}>
        <SurfaceCard elevated style={styles.contentCard} testID="today-main-card">
          {todayFeed.length === 0 ? (
            <StateCard
              variant="empty"
              title={copy.today.emptyTitle}
              description={copy.today.emptyDescription}
            />
          ) : overdueTasks.length > 0 ? (
            <View style={styles.contentCard}>
              <CollapsibleSection
                count={overdueTasks.length}
                defaultOpen
                title={copy.today.overdueTitle}
              >
                <View style={styles.sectionContent}>{overdueTasks.map(renderTodayTaskCard)}</View>
              </CollapsibleSection>
              {todayTasks.length > 0 ? (
                <CollapsibleSection
                  count={todayTasks.length}
                  defaultOpen
                  title={copy.today.sectionTitle}
                >
                  <View style={styles.sectionContent}>{todayTasks.map(renderTodayTaskCard)}</View>
                </CollapsibleSection>
              ) : null}
            </View>
          ) : todayTasks.length > 0 ? (
            <View style={styles.sectionContent}>{todayTasks.map(renderTodayTaskCard)}</View>
          ) : (
            <StateCard
              variant="empty"
              title={copy.today.emptyTitle}
              description={copy.today.emptyDescription}
            />
          )}
        </SurfaceCard>
      </ScreenShell>

      <TaskEditSheet />
    </>
  );
}
