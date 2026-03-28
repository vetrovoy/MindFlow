import type { CopyDictionary } from "@mindflow/copy";
import type { IconProps } from "@/shared/ui/icons";
import type { Task } from "@mindflow/domain";
import styles from './index.module.css'

export function getTaskPriorityTone(
  priority: Task["priority"]
): IconProps["tone"] {
  if (priority === "high") {
    return "alert";
  }

  if (priority === "medium") {
    return "lime";
  }

  return "muted";
}

export function getTaskPriorityMark(priority: Task["priority"]) {
  if (priority === "high") {
    return "H";
  }

  if (priority === "medium") {
    return "M";
  }

  return "L";
}

export function getTaskPriorityMarkStyle(priority: Task["priority"]) {
  if (priority === "high") {
    return styles.priorityMarkHight;
  }

  if (priority === "medium") {
    return styles.priorityMarkMedium;
  }

  return styles.priorityMark;
}

export function getTaskPriorityIconName(priority: Task["priority"]) {
  if (priority === "high") {
    return "priority-high" as const;
  }

  if (priority === "medium") {
    return "priority-medium" as const;
  }

  return "priority-low" as const;
}

export function getTaskToggleAriaLabel(
  copy: CopyDictionary,
  status: Task["status"]
) {
  return status === "done"
    ? copy.task.restoreAriaLabel
    : copy.task.toggleDoneAriaLabel;
}
