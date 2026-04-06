import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import type { CopyDictionary } from "@mindflow/copy";

import type { IconName } from "@/shared/ui";
import styles from "../index.module.css";

export function getTaskPriorityLabel(
  copy: CopyDictionary,
  priority: TaskPriority
) {
  switch (priority) {
    case "high":
      return copy.priority.high;
    case "low":
      return copy.priority.low;
    default:
      return copy.priority.medium;
  }
}

export function getTaskStatusLabel(copy: CopyDictionary, status: TaskStatus) {
  return status === "done" ? copy.status.done : copy.status.todo;
}

export function getTaskPriorityIconName(_priority: TaskPriority): IconName {
  return "flag";
}

export function getTaskStatusIconName(status: TaskStatus): IconName {
  return status === "done" ? "checkbox-checked" : "checkbox-empty";
}

export function getTaskDueDateChipToneClass(dueDate: string) {
  if (!dueDate) {
    return styles.metaChipMuted;
  }
  return styles.metaChipLime;
}
