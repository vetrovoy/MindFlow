import type { Project, Task, TaskPriority, TaskStatus } from "../types";

const CALENDAR_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UTC_ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function assertNonEmpty(value: string, field: string) {
  if (!value.trim()) {
    throw new Error(`${field} must not be empty`);
  }
}

function assertCalendarDate(value: string | null | undefined, field: string) {
  if (value == null) {
    return;
  }

  if (!CALENDAR_DATE_RE.test(value)) {
    throw new Error(`${field} must use YYYY-MM-DD`);
  }
}

function assertUtcIso(value: string | null | undefined, field: string) {
  if (value == null) {
    return;
  }

  if (!UTC_ISO_RE.test(value)) {
    throw new Error(`${field} must use a UTC ISO string`);
  }
}

function assertTaskStatus(value: TaskStatus) {
  if (value !== "todo" && value !== "done") {
    throw new Error("task status is invalid");
  }
}

function assertTaskPriority(value: TaskPriority) {
  if (value !== "low" && value !== "medium" && value !== "high") {
    throw new Error("task priority is invalid");
  }
}

export function validateTask(task: Task): Task {
  assertNonEmpty(task.id, "task.id");
  assertNonEmpty(task.title, "task.title");
  assertTaskStatus(task.status);
  assertTaskPriority(task.priority);
  assertCalendarDate(task.dueDate, "task.dueDate");
  assertUtcIso(task.createdAt, "task.createdAt");
  assertUtcIso(task.updatedAt, "task.updatedAt");
  assertUtcIso(task.completedAt, "task.completedAt");
  assertUtcIso(task.archivedAt, "task.archivedAt");

  if (!Number.isFinite(task.orderIndex)) {
    throw new Error("task.orderIndex must be a finite number");
  }

  if (task.description != null && typeof task.description !== "string") {
    throw new Error("task.description must be a string or null");
  }

  return task;
}

export function validateProject(project: Project): Project {
  assertNonEmpty(project.id, "project.id");
  assertNonEmpty(project.name, "project.name");
  assertNonEmpty(project.color, "project.color");
  assertNonEmpty(project.emoji, "project.emoji");
  assertCalendarDate(project.deadline, "project.deadline");
  assertUtcIso(project.createdAt, "project.createdAt");
  assertUtcIso(project.updatedAt, "project.updatedAt");
  assertUtcIso(project.archivedAt, "project.archivedAt");

  return project;
}
