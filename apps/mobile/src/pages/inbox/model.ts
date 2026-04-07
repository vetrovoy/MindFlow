import type { Task } from '@mindflow/domain';
import type { AppStore } from '@shared/model/types';

type InboxTasksState = {
  activeInboxTasks: Task[];
  completedInboxTasks: Task[];
  badgeByTaskId: Partial<Record<string, 'today' | 'overdue'>>;
};

export function getInboxTasksState(
  tasks: AppStore['derived']['inboxTasks'],
  todayFeed: AppStore['derived']['todayFeed'],
): InboxTasksState {
  const activeInboxTasks: Task[] = [];
  const completedInboxTasks: Task[] = [];
  const badgeByTaskId: Partial<Record<string, 'today' | 'overdue'>> = {};

  for (const item of todayFeed) {
    badgeByTaskId[item.task.id] =
      item.bucket === 'overdue' ? 'overdue' : 'today';
  }

  for (const task of tasks) {
    if (task.status === 'done') {
      completedInboxTasks.push(task);
      continue;
    }

    activeInboxTasks.push(task);
  }

  return {
    activeInboxTasks,
    completedInboxTasks,
    badgeByTaskId,
  };
}
