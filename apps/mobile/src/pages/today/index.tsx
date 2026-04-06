import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { TodayTaskGroup } from '@mindflow/domain';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useCopy } from '@shared/lib/use-copy';
import { ErrorBoundary } from '@shared/ui/error-boundary';
import {
  CollapsibleSection,
  RefreshControl,
  ScreenShell,
  StateCard,
  SurfaceCard,
  TodayTaskCard,
} from '@shared/ui/primitives';
import { FlashList } from '@shopify/flash-list';

const styles = StyleSheet.create({
  contentCard: {
    gap: 14,
  },
  sectionContent: {
    gap: 10,
  },
});

export function TodayPage() {
  const copy = useCopy();
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const reload = useMobileAppStore(store => store.actions.reload);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const { overdueTasks, todayTasks } = useMemo(() => {
    const overdue: TodayTaskGroup[] = [];
    const today: TodayTaskGroup[] = [];

    for (const item of todayFeed) {
      if (item.bucket === 'overdue') {
        overdue.push(item);
      } else {
        today.push(item);
      }
    }

    return { overdueTasks: overdue, todayTasks: today };
  }, [todayFeed]);

  const taskData = useMemo(
    () => [...overdueTasks, ...todayTasks],
    [overdueTasks, todayTasks],
  );

  const keyExtractor = useCallback(
    (item: TodayTaskGroup) => `${item.bucket}-${item.task.id}`,
    [],
  );

  const getItemType = useCallback(() => 'task-card', []);

  const renderHeader = useCallback(() => {
    if (todayFeed.length === 0) {
      return (
        <SurfaceCard
          elevated
          style={styles.contentCard}
          testID="today-main-card"
        >
          <StateCard
            variant="empty"
            title={copy.today.emptyTitle}
            description={copy.today.emptyDescription}
          />
        </SurfaceCard>
      );
    }

    return (
      <SurfaceCard elevated style={styles.contentCard} testID="today-main-card">
        {overdueTasks.length > 0 ? (
          <View style={styles.contentCard}>
            <CollapsibleSection
              count={overdueTasks.length}
              defaultOpen
              title={copy.today.overdueTitle}
            >
              <View style={styles.sectionContent}>
                {overdueTasks.map(item => (
                  <TodayTaskCard
                    key={`${item.bucket}-${item.task.id}`}
                    item={item}
                    onOpenTask={openTaskEdit}
                    onToggleDone={toggleTask}
                  />
                ))}
              </View>
            </CollapsibleSection>
            {todayTasks.length > 0 && (
              <CollapsibleSection
                count={todayTasks.length}
                defaultOpen
                title={copy.today.sectionTitle}
              >
                <View style={styles.sectionContent}>
                  {todayTasks.map(item => (
                    <TodayTaskCard
                      key={`${item.bucket}-${item.task.id}`}
                      item={item}
                      onOpenTask={openTaskEdit}
                      onToggleDone={toggleTask}
                    />
                  ))}
                </View>
              </CollapsibleSection>
            )}
          </View>
        ) : todayTasks.length > 0 ? (
          <View style={styles.sectionContent}>
            {todayTasks.map(item => (
              <TodayTaskCard
                key={`${item.bucket}-${item.task.id}`}
                item={item}
                onOpenTask={openTaskEdit}
                onToggleDone={toggleTask}
              />
            ))}
          </View>
        ) : (
          <StateCard
            variant="empty"
            title={copy.today.emptyTitle}
            description={copy.today.emptyDescription}
          />
        )}
      </SurfaceCard>
    );
  }, [
    todayFeed.length,
    overdueTasks,
    todayTasks,
    copy,
    openTaskEdit,
    toggleTask,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: TodayTaskGroup }) => (
      <TodayTaskCard
        item={item}
        onOpenTask={openTaskEdit}
        onToggleDone={toggleTask}
      />
    ),
    [openTaskEdit, toggleTask],
  );

  return (
    <ErrorBoundary>
      <ScreenShell>
        <FlashList
          data={taskData}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </ScreenShell>
    </ErrorBoundary>
  );
}
