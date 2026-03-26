import type { TaskPriority, TaskStatus } from "@mindflow/domain";

export const PRIORITY_OPTIONS: Array<{
  value: TaskPriority;
  label: string;
  helper?: string;
}> = [
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" }
];

export const STATUS_OPTIONS: Array<{
  value: TaskStatus;
  label: string;
  helper?: string;
}> = [
  { value: "todo", label: "В работе" },
  { value: "done", label: "Готово" }
];

export const INBOX_SELECT_VALUE = "__inbox__";

export interface TaskEditFormValues {
  title: string;
  description: string;
  projectId: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export const DEFAULT_VALUES: TaskEditFormValues = {
  title: "",
  description: "",
  projectId: INBOX_SELECT_VALUE,
  dueDate: "",
  priority: "medium",
  status: "todo"
};
