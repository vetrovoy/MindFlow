import { StyleSheet, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import {
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
});

export function TodayPage() {
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);

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
          ) : (
            <View style={styles.contentCard}>
              {todayFeed.map(item => (
                <TodayTaskCard key={`${item.bucket}-${item.task.id}`} item={item} onToggleDone={toggleTask} />
              ))}
            </View>
          )}
        </SurfaceCard>
      </ScreenShell>

      <TaskEditSheet />
    </>
  );
}
