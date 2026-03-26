import type { TaskPriority, TaskStatus } from "@mindflow/domain";

import type { IconName } from "@/shared/ui";
import styles from "../index.module.css";

export function getTaskPriorityLabel(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return "Высокий";
    case "low":
      return "Низкий";
    default:
      return "Средний";
  }
}

export function getTaskStatusLabel(status: TaskStatus) {
  return status === "done" ? "Готово" : "В работе";
}

export function getTaskPriorityIconName(_priority: TaskPriority): IconName {
  return "flag";
}

export function getTaskStatusIconName(status: TaskStatus): IconName {
  return status === "done" ? "checkbox-checked" : "checkbox-empty";
}

export function getTaskDueDateChipToneClass(dueDateLabel: string) {
  if (dueDateLabel === "Без срока") {
    return styles.metaChipMuted;
  }

  if (
    dueDateLabel.toLowerCase().includes("сегодня") ||
    dueDateLabel.toLowerCase().includes("мар")
  ) {
    return styles.metaChipLime;
  }

  return "";
}
