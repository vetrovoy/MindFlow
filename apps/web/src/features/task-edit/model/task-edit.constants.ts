import type { TaskPriority, TaskStatus } from "@mindflow/domain";

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
