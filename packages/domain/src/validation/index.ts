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

function normalizeCalendarDate(
  value: string | null | undefined
): string | null {
  if (value == null || !value.trim()) {
    return null;
  }

  // If it's an ISO string (contains T), take only the date part
  if (value.includes("T")) {
    return value.split("T")[0];
  }

  return value.trim();
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
  const normalizedDueDate = normalizeCalendarDate(task.dueDate);
  const nextTask = { ...task, dueDate: normalizedDueDate };

  assertNonEmpty(nextTask.id, "task.id");
  assertNonEmpty(nextTask.title, "task.title");
  assertTaskStatus(nextTask.status);
  assertTaskPriority(nextTask.priority);
  assertCalendarDate(nextTask.dueDate, "task.dueDate");
  assertUtcIso(nextTask.createdAt, "task.createdAt");
  assertUtcIso(nextTask.updatedAt, "task.updatedAt");
  assertUtcIso(nextTask.completedAt, "task.completedAt");
  assertUtcIso(nextTask.archivedAt, "task.archivedAt");

  if (!Number.isFinite(nextTask.orderIndex)) {
    throw new Error("task.orderIndex must be a finite number");
  }

  if (
    nextTask.description != null &&
    typeof nextTask.description !== "string"
  ) {
    throw new Error("task.description must be a string or null");
  }

  return nextTask;
}

export function validateProject(project: Project): Project {
  const normalizedDeadline = normalizeCalendarDate(project.deadline);
  const nextProject = { ...project, deadline: normalizedDeadline };

  assertNonEmpty(nextProject.id, "project.id");
  assertNonEmpty(nextProject.name, "project.name");
  assertNonEmpty(nextProject.color, "project.color");
  assertNonEmpty(nextProject.emoji, "project.emoji");
  assertCalendarDate(nextProject.deadline, "project.deadline");
  assertUtcIso(nextProject.createdAt, "project.createdAt");
  assertUtcIso(nextProject.updatedAt, "project.updatedAt");
  assertUtcIso(nextProject.archivedAt, "project.archivedAt");

  return nextProject;
}
