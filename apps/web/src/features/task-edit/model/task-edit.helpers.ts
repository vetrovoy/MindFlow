import type { TaskEditFormValues } from "./task-edit.constants";

export function createTaskEditDraftSignature(values: TaskEditFormValues) {
  return JSON.stringify(values);
}
