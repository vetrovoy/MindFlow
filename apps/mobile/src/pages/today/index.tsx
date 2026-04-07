import { useMemo } from 'react';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';
import { TodayTaskFeed } from '@widgets/today-task-feed/ui/today-task-feed';
import { getTodayFeedState } from './model';
import { ScrollView } from 'react-native-gesture-handler';

export function TodayPage() {
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const { overdueTasks, todayTasks } = useMemo(
    () => getTodayFeedState(todayFeed),
    [todayFeed],
  );

  return (
    <ScreenShell>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsHorizontalScrollIndicator={false}
      >
        <TodayTaskFeed
          overdueTasks={overdueTasks}
          todayTasks={todayTasks}
          onOpenTask={openTaskEdit}
          onToggleDone={toggleTask}
        />
      </ScrollView>
    </ScreenShell>
  );
}
