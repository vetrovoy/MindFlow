import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Task } from '@mindflow/domain';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useCopy } from '@shared/lib/use-copy';
import {
  CollapsibleSection,
  RefreshControl,
  ScreenShell,
  StateCard,
  SurfaceCard,
  TaskRow,
} from '@shared/ui/primitives';
import { ErrorBoundary } from '@shared/ui/error-boundary';
import { FlashList } from '@shopify/flash-list';

const styles = StyleSheet.create({
  mainCard: {
    gap: 14,
  },
  taskList: {
    gap: 10,
  },
});

export function InboxPage() {
  const tasks = useMobileAppStore(store => store.derived.inboxTasks);
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const reload = useMobileAppStore(store => store.actions.reload);
  const copy = useCopy();
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const inboxCardData = useMemo(() => ['inbox-main-card'], []);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const { activeInboxTasks, completedInboxTasks, badgeByTaskId } =
    useMemo(() => {
      const active: Task[] = [];
      const completed: Task[] = [];
      const nextBadgeByTaskId: Partial<Record<string, 'today' | 'overdue'>> =
        {};

      for (const item of todayFeed) {
        nextBadgeByTaskId[item.task.id] =
          item.bucket === 'overdue' ? 'overdue' : 'today';
      }

      for (const task of tasks) {
        if (task.status === 'done') {
          completed.push(task);
        } else {
          active.push(task);
        }
      }

      return {
        activeInboxTasks: active,
        completedInboxTasks: completed,
        badgeByTaskId: nextBadgeByTaskId,
      };
    }, [tasks, todayFeed]);

  const keyExtractor = useCallback((item: string) => item, []);

  const getItemType = useCallback(() => 'content-card', []);

  const renderTaskRow = useCallback(
    (task: Task) => (
      <TaskRow
        key={task.id}
        presentation="inbox"
        task={task}
        badgeVariant={badgeByTaskId[task.id]}
        onOpenTask={openTaskEdit}
        onToggleDone={toggleTask}
      />
    ),
    [badgeByTaskId, openTaskEdit, toggleTask],
  );

  const renderItem = useCallback(() => {
    const hasInboxContent = tasks.length > 0;

    return (
      <SurfaceCard elevated style={styles.mainCard}>
        {hasInboxContent ? (
          <>
            {activeInboxTasks.length > 0 ? (
              <View style={styles.taskList}>
                {activeInboxTasks.map(renderTaskRow)}
              </View>
            ) : null}
            {completedInboxTasks.length > 0 ? (
              <CollapsibleSection
                count={completedInboxTasks.length}
                defaultOpen={activeInboxTasks.length === 0}
                title={copy.inbox.completedTitle}
              >
                <View style={styles.taskList}>
                  {completedInboxTasks.map(renderTaskRow)}
                </View>
              </CollapsibleSection>
            ) : null}
          </>
        ) : (
          <StateCard
            variant="empty"
            title={copy.inbox.emptyTitle}
            description={copy.inbox.emptyDescription}
          />
        )}
      </SurfaceCard>
    );
  }, [
    activeInboxTasks,
    completedInboxTasks,
    renderTaskRow,
    tasks.length,
    copy,
  ]);

  return (
    <ErrorBoundary>
      <ScreenShell>
        <FlashList
          data={inboxCardData}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          overrideItemLayout={(layout: { span?: number }, _item: string) => {
            layout.span = 1;
          }}
          renderItem={renderItem}
          ListEmptyComponent={null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </ScreenShell>
    </ErrorBoundary>
  );
}
