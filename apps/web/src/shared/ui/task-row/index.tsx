import type { ReactNode } from "react";
import type { Task } from "@mindflow/domain";

import { cn } from "@/shared/lib/cn";
import { MetaText } from "@/shared/ui/typography";
import { StatusPill } from "@/shared/ui/primitives";
import { Icon } from "@/shared/ui/icons";
import {
  getTaskPriorityIconName,
  getTaskPriorityMark,
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
          aria-label={getTaskToggleAriaLabel(task.status)}
          className={cn(styles.checkbox, isDone && styles.checkboxDone)}
          onClick={() => {
            void onToggleDone(task.id);
          }}
          type="button"
        />
        <button
          className={styles.contentButton}
          onClick={() => {
            onOpenTask(task.id);
          }}
          type="button"
        >
          <strong className={cn(styles.title, isDone && styles.titleDone)}>
            {task.title}
          </strong>
        </button>
        <div className={styles.trailing}>
          {badgeVariant == null ? null : (
            <StatusPill
              label={badgeVariant === "overdue" ? "Просрочено" : "Сегодня"}
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
            <MetaText className={styles.priorityMark}>
              {getTaskPriorityMark(task.priority)}
            </MetaText>
          </div>
          {trailingSlot}
        </div>
      </div>
    </article>
  );
}
