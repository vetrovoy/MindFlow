import type { AppStore } from '@shared/model/types';

type TodayFeedState = {
  overdueTasks: AppStore['derived']['todayFeed'];
  todayTasks: AppStore['derived']['todayFeed'];
};

export function getTodayFeedState(
  todayFeed: AppStore['derived']['todayFeed'],
): TodayFeedState {
  const overdueTasks: typeof todayFeed = [];
  const todayTasks: typeof todayFeed = [];

  for (const item of todayFeed) {
    if (item.bucket === 'overdue') {
      overdueTasks.push(item);
      continue;
    }

    todayTasks.push(item);
  }

  return {
    overdueTasks,
    todayTasks,
  };
}
