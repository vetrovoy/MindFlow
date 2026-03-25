import type { Task } from "@mindflow/domain";

import { cn } from "@/shared/lib/cn";
import { MetaText } from "@/shared/ui/typography";
import { StatusPill } from "@/shared/ui/primitives";
import { Icon } from "@/shared/ui/icons";
import styles from "./index.module.css";

interface TaskRowProps {
  task: Task;
  selected?: boolean;
  badgeVariant?: "today" | "overdue";
  onToggleDone: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
}

function getPriorityTone(priority: Task["priority"]) {
  if (priority === "high") {
    return "alert" as const;
  }

  if (priority === "medium") {
    return "lime" as const;
  }

  return "muted" as const;
}

function getPriorityMark(priority: Task["priority"]) {
  if (priority === "high") {
    return "H";
  }

  if (priority === "medium") {
    return "M";
  }

  return "L";
}

export function TaskRow({
  badgeVariant,
  onOpenTask,
  onToggleDone,
  selected = false,
  task
}: TaskRowProps) {
  const isDone = task.status === "done";

  return (
    <article className={cn(styles.item, selected && styles.itemSelected)}>
      <div className={styles.row}>
        <button
          aria-label={
            isDone ? "Вернуть задачу в работу" : "Отметить задачу выполненной"
          }
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
              name={
                task.priority === "high"
                  ? "priority-high"
                  : task.priority === "medium"
                    ? "priority-medium"
                    : "priority-low"
              }
              size={12}
              tone={getPriorityTone(task.priority)}
            />
            <MetaText className={styles.priorityMark}>
              {getPriorityMark(task.priority)}
            </MetaText>
          </div>
        </div>
      </div>
    </article>
  );
}
