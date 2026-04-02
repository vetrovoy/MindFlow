import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Project, Task } from '@mindflow/domain';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Meta } from '../../typography';
import { SurfaceCard } from '../surface-card';
import { StatusPill, type StatusPillProps } from '../status-pill';

interface TaskRowProps {
  task: Task;
  onToggleDone: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
  badgeVariant?: StatusPillProps['variant'];
  project?: Project | null;
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  taskMain: {
    flex: 1,
    gap: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});

function getPriorityColor(
  priority: Task['priority'],
  accent: string,
  soft: string,
  muted: string,
) {
  switch (priority) {
    case 'high':
      return accent;
    case 'medium':
      return soft;
    case 'low':
    default:
      return muted;
  }
}

function getTaskStatusText(task: Task) {
  return task.status === 'done' ? 'Готово' : 'В работе';
}

const PRESSABLE_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 } as const;

export const TaskRow = React.memo(function TaskRow({
  task,
  project,
  badgeVariant,
  onToggleDone,
  onOpenTask,
}: TaskRowProps) {
  const { theme } = useTheme();
  const isDone = task.status === 'done';
  const priorityColor = getPriorityColor(
    task.priority,
    theme.colors.accentAlert,
    theme.colors.accentPrimary,
    theme.colors.textTertiary,
  );

  return (
    <SurfaceCard padded={false}>
      <View
        style={[
          styles.taskRow,
          {
            backgroundColor: isDone ? theme.colors.overlayGhost : theme.colors.surfaceCard,
            borderColor: isDone ? theme.colors.borderSoft : theme.colors.borderMuted,
          },
        ]}
      >
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDone }}
          hitSlop={PRESSABLE_HIT_SLOP}
          onPress={() => {
            void onToggleDone(task.id);
          }}
          style={[
            styles.checkbox,
            {
              borderColor: isDone ? theme.colors.accentPrimary : theme.colors.borderStrong,
              backgroundColor: isDone ? theme.colors.accentPrimary : 'transparent',
            },
          ]}
        >
          {isDone ? <Meta style={{ color: theme.colors.background }}>OK</Meta> : null}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={onOpenTask == null}
          hitSlop={PRESSABLE_HIT_SLOP}
          onPress={() => {
            onOpenTask?.(task.id);
          }}
          style={styles.taskMain}
        >
          <Body
            variant="task"
            tone={isDone ? 'muted' : 'primary'}
            style={isDone ? { textDecorationLine: 'line-through' } : undefined}
          >
            {task.title}
          </Body>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Meta tone="soft">{task.priority.toUpperCase()}</Meta>
            <Meta tone="muted">{getTaskStatusText(task)}</Meta>
            {project ? <Meta tone="soft">{project.emoji} {project.name}</Meta> : null}
            {badgeVariant ? (
              <StatusPill
                label={badgeVariant === 'overdue' ? 'Overdue' : 'Today'}
                variant={badgeVariant}
              />
            ) : null}
          </View>
        </Pressable>
      </View>
    </SurfaceCard>
  );
});

export type { TaskRowProps };
