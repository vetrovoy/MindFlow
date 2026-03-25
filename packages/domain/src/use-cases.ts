import type {
  Project,
  ProjectCreateInput,
  Task,
  TaskCreateInput
} from "./entities";
import { validateProject, validateTask } from "./validation";

function trimTitle(title: string) {
  return title.trim();
}

export function createTask(input: TaskCreateInput): Task {
  return validateTask({
    id: input.id,
    title: trimTitle(input.title),
    status: "todo",
    priority: input.priority ?? "medium",
    dueDate: input.dueDate ?? null,
    projectId: input.projectId ?? null,
    orderIndex: input.orderIndex ?? 0,
    createdAt: input.now,
    updatedAt: input.now,
    completedAt: null,
    archivedAt: null
  });
}

export function createProject(input: ProjectCreateInput): Project {
  return validateProject({
    id: input.id,
    name: input.name.trim(),
    color: input.color,
    emoji: input.emoji,
    isFavorite: input.isFavorite ?? false,
    deadline: input.deadline ?? null,
    createdAt: input.now,
    updatedAt: input.now,
    archivedAt: null
  });
}

export function updateTask(
  task: Task,
  updates: Partial<Pick<Task, "title" | "priority" | "dueDate" | "projectId">>,
  now: string
) {
  return validateTask({
    ...task,
    ...updates,
    title: updates.title == null ? task.title : trimTitle(updates.title),
    updatedAt: now
  });
}

export function toggleTaskDone(task: Task, now: string) {
  const nextStatus = task.status === "done" ? "todo" : "done";

  return validateTask({
    ...task,
    status: nextStatus,
    completedAt: nextStatus === "done" ? now : null,
    updatedAt: now
  });
}

export function archiveTask(task: Task, now: string) {
  return validateTask({
    ...task,
    archivedAt: now,
    updatedAt: now
  });
}

export function restoreTask(task: Task, now: string) {
  return validateTask({
    ...task,
    archivedAt: null,
    updatedAt: now
  });
}

export function archiveProject(project: Project, now: string) {
  return validateProject({
    ...project,
    archivedAt: now,
    updatedAt: now
  });
}

export function restoreProject(project: Project, now: string) {
  return validateProject({
    ...project,
    archivedAt: null,
    updatedAt: now
  });
}

export function bulkMoveToProject(
  tasks: Task[],
  selectedTaskIds: string[],
  targetProjectId: string,
  now: string
) {
  const selectedOrder = new Map(selectedTaskIds.map((id, index) => [id, index]));
  const selectedTasks = tasks
    .filter((task) => selectedOrder.has(task.id))
    .sort((left, right) => {
      return selectedOrder.get(left.id)! - selectedOrder.get(right.id)!;
    });

  return selectedTasks.map((task, index) =>
    validateTask({
      ...task,
      projectId: targetProjectId,
      orderIndex: index,
      updatedAt: now
    })
  );
}

export function reorderTasks(tasks: Task[], orderedTaskIds: string[], now: string) {
  const orderMap = new Map(orderedTaskIds.map((id, index) => [id, index]));

  return tasks.map((task) => {
    const nextOrderIndex = orderMap.get(task.id);

    if (nextOrderIndex == null) {
      return task;
    }

    return validateTask({
      ...task,
      orderIndex: nextOrderIndex,
      updatedAt: now
    });
  });
}
