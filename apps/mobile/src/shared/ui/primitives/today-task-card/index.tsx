import type { TodayTaskGroup } from '@mindflow/domain';

import type { StatusPillProps } from '../status-pill';
import { TaskRow } from '../task-row';

interface TodayTaskCardProps {
  item: TodayTaskGroup;
  onToggleDone: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
}

export function TodayTaskCard({
  item,
  onOpenTask,
  onToggleDone,
}: TodayTaskCardProps) {
  const badgeVariant: StatusPillProps['variant'] =
    item.bucket === 'overdue' ? 'overdue' : 'today';

  return (
    <TaskRow
      badgeVariant={badgeVariant}
      onOpenTask={onOpenTask}
      onToggleDone={onToggleDone}
      presentation="inbox"
      task={item.task}
    />
  );
}

export type { TodayTaskCardProps };
