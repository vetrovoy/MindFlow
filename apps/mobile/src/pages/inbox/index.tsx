import { useMemo } from 'react';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';
import { InboxContent } from '@widgets/inbox-content/ui/inbox-content';
import { getInboxTasksState } from './model';

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
      <InboxContent
        activeInboxTasks={activeInboxTasks}
        completedInboxTasks={completedInboxTasks}
        badgeByTaskId={badgeByTaskId}
        onOpenTask={openTaskEdit}
        onToggleDone={toggleTask}
      />
    </ScreenShell>
  );
}
