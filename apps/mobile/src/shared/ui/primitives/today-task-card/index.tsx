import { View } from 'react-native';
import type { TodayTaskGroup } from '@mindflow/domain';

import type { StatusPillProps } from '../status-pill';
import { StatusPill } from '../status-pill';
import { TaskRow } from '../task-row';

interface TodayTaskCardProps {
  item: TodayTaskGroup;
  onToggleDone: (taskId: string) => void;
}

function getBucketLabel(bucket: TodayTaskGroup['bucket']) {
  switch (bucket) {
    case 'overdue':
      return 'Просрочено';
    case 'due-today':
      return 'Сегодня';
    case 'high-priority-inbox':
      return 'Inbox / high';
    default:
      return '';
  }
}

export function TodayTaskCard({ item, onToggleDone }: TodayTaskCardProps) {
  const badgeVariant: StatusPillProps['variant'] =
    item.bucket === 'overdue' ? 'overdue' : 'today';

  return (
    <View style={{ gap: 8 }}>
      <StatusPill label={getBucketLabel(item.bucket)} variant={badgeVariant} />
      <TaskRow task={item.task} badgeVariant={badgeVariant} onToggleDone={onToggleDone} />
    </View>
  );
}

export type { TodayTaskCardProps };
