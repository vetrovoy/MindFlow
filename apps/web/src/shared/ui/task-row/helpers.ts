import type { IconProps } from "@/shared/ui/icons";
import type { Task } from "@mindflow/domain";

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

export function getTaskPriorityIconName(priority: Task["priority"]) {
  if (priority === "high") {
    return "priority-high" as const;
  }

  if (priority === "medium") {
    return "priority-medium" as const;
  }

  return "priority-low" as const;
}

export function getTaskToggleAriaLabel(status: Task["status"]) {
  return status === "done"
    ? "Вернуть задачу в работу"
    : "Отметить задачу выполненной";
}
