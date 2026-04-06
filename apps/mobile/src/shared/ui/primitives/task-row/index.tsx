import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Project, Task } from '@mindflow/domain';

import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Icon } from '../../icons';
import { Body, Meta } from '../../typography';
import { SurfaceCard } from '../surface-card';
import { StatusPill, type StatusPillProps } from '../status-pill';


interface TaskRowProps {
  task: Task;
  onToggleDone: (taskId: string) => void;
  onOpenTask?: (taskId: string) => void;
  badgeVariant?: StatusPillProps['variant'];
  project?: Project | null;
  presentation?: 'default' | 'inbox';
  accessory?: React.ReactNode;
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
  taskRowInbox: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
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
  taskMetaInbox: {
    gap: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
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

function getPriorityTone(priority: Task['priority']) {
  switch (priority) {
    case 'high':
      return 'alert' as const;
    case 'medium':
      return 'accent' as const;
    case 'low':
    default:
      return 'muted' as const;
  }
}

function getPriorityTextTone(priority: Task['priority']) {
  switch (priority) {
    case 'high':
      return 'danger' as const;
    case 'medium':
      return 'accent' as const;
    case 'low':
    default:
      return 'muted' as const;
  }
}

const PRESSABLE_HIT_SLOP = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
} as const;

export const TaskRow = React.memo(function TaskRow({
  task,
  project,
  badgeVariant,
  onToggleDone,
  onOpenTask,
  presentation = 'default',
  accessory,
}: TaskRowProps) {
  const { theme } = useTheme();
  const copy = useCopy();
  const isDone = task.status === 'done';
  const isInboxPresentation = presentation === 'inbox';
  const priorityColor = getPriorityColor(
    task.priority,
    theme.colors.accentAlert,
    theme.colors.accentPrimary,
    theme.colors.textTertiary,
  );
  const priorityTone = getPriorityTone(task.priority);
  const priorityTextTone = getPriorityTextTone(task.priority);

  const content = (
    <View
      style={[
        styles.taskRow,
        isInboxPresentation && styles.taskRowInbox,
        {
          backgroundColor: isDone
            ? theme.colors.overlayGhost
            : theme.colors.surfaceCard,
          borderColor: isInboxPresentation
            ? theme.colors.borderSoft
            : isDone
              ? theme.colors.borderSoft
              : theme.colors.borderMuted,
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
            borderColor: isDone
              ? theme.colors.accentPrimary
              : theme.colors.borderStrong,
            backgroundColor: isDone
              ? theme.colors.accentPrimary
              : 'transparent',
          },
        ]}
      />
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
          numberOfLines={1}
          variant="task"
          tone={isDone ? 'muted' : 'primary'}
          style={isDone ? { textDecorationLine: 'line-through' } : undefined}
        >
          {task.title}
        </Body>
        <View
          style={[styles.taskMeta, isInboxPresentation && styles.taskMetaInbox]}
        >
          {isInboxPresentation ? (
            <>
              {badgeVariant ? (
                <StatusPill
                  label={
                    badgeVariant === 'overdue'
                      ? copy.task.badgeOverdue
                      : copy.task.badgeToday
                  }
                  variant={badgeVariant}
                />
              ) : null}
              <View
                style={[
                  styles.priorityBadge,
                  {
                    borderColor: theme.colors.borderSoft,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <Icon
                  decorative
                  name={`priority-${task.priority}` as const}
                  size={12}
                  tone={priorityTone}
                />
                <Meta tone={priorityTextTone}>
                  {copy.priority[task.priority]}
                </Meta>
              </View>
            </>
          ) : (
            <>
              <Icon
                decorative
                name={`priority-${task.priority}` as const}
                size={14}
                tone={priorityTone}
              />
              <View
                style={[styles.priorityDot, { backgroundColor: priorityColor }]}
              />
              <Meta tone="soft">{copy.priority[task.priority]}</Meta>
              <Meta tone="muted">
                {task.status === 'done' ? copy.status.done : copy.status.todo}
              </Meta>
              {project ? (
                <Meta tone="soft">
                  {project.emoji} {project.name}
                </Meta>
              ) : null}
              {badgeVariant ? (
                <StatusPill
                  label={
                    badgeVariant === 'overdue'
                      ? copy.task.badgeOverdue
                      : copy.task.badgeToday
                  }
                  variant={badgeVariant}
                />
              ) : null}
            </>
          )}
        </View>
      </Pressable>
      {accessory && accessory}
    </View>
  );

  if (isInboxPresentation) {
    return content;
  }

  return <SurfaceCard padded={false}>{content}</SurfaceCard>;
});

export type { TaskRowProps };
