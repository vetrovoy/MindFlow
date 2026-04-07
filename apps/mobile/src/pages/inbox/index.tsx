import { useMemo } from 'react';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';
import { InboxContent } from '@widgets/inbox-content/ui/inbox-content';
import { getInboxTasksState } from './model';
import { ScrollView } from 'react-native-gesture-handler';

export function InboxPage() {
  const tasks = useMobileAppStore(store => store.derived.inboxTasks);
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const { activeInboxTasks, completedInboxTasks, badgeByTaskId } = useMemo(
    () => getInboxTasksState(tasks, todayFeed),
    [tasks, todayFeed],
  );

  return (
    <ScreenShell>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <InboxContent
          activeInboxTasks={activeInboxTasks}
          completedInboxTasks={completedInboxTasks}
          badgeByTaskId={badgeByTaskId}
          onOpenTask={openTaskEdit}
          onToggleDone={toggleTask}
        />
      </ScrollView>
    </ScreenShell>
  );
}
