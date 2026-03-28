import type { ReactNode } from "react";
import type { Task } from "@mindflow/domain";

import { useCopy } from "@/app/providers/language-provider";
import { cn } from "@/shared/lib/cn";
import { MetaText } from "@/shared/ui/typography";
import { StatusPill } from "@/shared/ui/primitives";
import { Icon } from "@/shared/ui/icons";
import {
  getTaskPriorityIconName,
  getTaskPriorityMark,
  getTaskPriorityMarkStyle,
  getTaskPriorityTone,
  getTaskToggleAriaLabel
} from "./helpers";
import styles from "./index.module.css";

interface TaskRowProps {
  task: Task;
  selected?: boolean;
  isDragging?: boolean;
  badgeVariant?: "today" | "overdue";
  trailingSlot?: ReactNode;
  className?: string;
  onToggleDone: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
}

export function TaskRow({
  badgeVariant,
  className,
  isDragging = false,
  onOpenTask,
  onToggleDone,
  selected = false,
  task,
  trailingSlot
}: TaskRowProps) {
  const copy = useCopy();
  const isDone = task.status === "done";

  return (
    <article
      className={cn(
        styles.item,
        selected && styles.itemSelected,
        isDragging && styles.itemDragging,
        className
      )}
    >
      <div className={styles.row}>
        <button
          aria-label={getTaskToggleAriaLabel(copy, task.status)}
          className={cn(styles.checkbox, isDone && styles.checkboxDone)}
          onClick={() => {
            void onToggleDone(task.id);
          }}
          type="button"
        />
        <div className={styles.mainArea}>
          <button
            aria-label={copy.task.editTitle}
            className={styles.contentButton}
            onClick={() => {
              onOpenTask(task.id);
            }}
            type="button"
          />
          <strong className={cn(styles.title, isDone && styles.titleDone)}>
            {task.title}
          </strong>
        </div>
        <div className={styles.trailing}>
          {badgeVariant == null ? null : (
            <StatusPill
              label={
                badgeVariant === "overdue" ? copy.task.badgeOverdue : copy.task.badgeToday
              }
              variant={badgeVariant}
            />
          )}
          <div className={styles.priorityBadge}>
            <Icon
              className={styles.priorityIcon}
              name={getTaskPriorityIconName(task.priority)}
              size={12}
              tone={getTaskPriorityTone(task.priority)}
            />
            <MetaText className={getTaskPriorityMarkStyle(task.priority)}>
              {getTaskPriorityMark(task.priority)}
            </MetaText>
          </div>
          {trailingSlot}
        </div>
      </div>
    </article>
  );
}
