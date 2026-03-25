export type IconName =
  | "add"
  | "archive"
  | "check"
  | "checkbox-empty"
  | "checkbox-checked"
  | "chevron-right"
  | "priority-low"
  | "priority-medium"
  | "priority-high"
  | "search"
  | "today"
  | "overdue"
  | "toast-success";

export const iconMap: Record<IconName, string> = {
  add: "plus",
  archive: "archive-box",
  check: "check",
  "checkbox-empty": "circle",
  "checkbox-checked": "circle-check",
  "chevron-right": "chevron-right",
  "priority-low": "priority-low",
  "priority-medium": "priority-medium",
  "priority-high": "priority-high",
  search: "search",
  today: "calendar-today",
  overdue: "calendar-overdue",
  "toast-success": "sparkles"
};
