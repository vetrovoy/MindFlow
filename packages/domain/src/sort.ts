import type { Task, TaskPriority } from "./entities";

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

export function compareCalendarDatesAsc(
  left: string | null | undefined,
  right: string | null | undefined
) {
  if (left == null && right == null) {
    return 0;
  }

  if (left == null) {
    return 1;
  }

  if (right == null) {
    return -1;
  }

  return left.localeCompare(right);
}

export function comparePriorityDesc(left: TaskPriority, right: TaskPriority) {
  return PRIORITY_WEIGHT[left] - PRIORITY_WEIGHT[right];
}

export function compareCreatedAtAsc(left: string, right: string) {
  return left.localeCompare(right);
}

export function compareTasksWithinMixedFeed(left: Task, right: Task) {
  const dueDateResult = compareCalendarDatesAsc(left.dueDate, right.dueDate);
  if (dueDateResult !== 0) {
    return dueDateResult;
  }

  const priorityResult = comparePriorityDesc(left.priority, right.priority);
  if (priorityResult !== 0) {
    return priorityResult;
  }

  const sharesParent =
    left.projectId === right.projectId && left.projectId !== undefined;

  if (sharesParent) {
    const orderResult = left.orderIndex - right.orderIndex;
    if (orderResult !== 0) {
      return orderResult;
    }
  }

  return compareCreatedAtAsc(left.createdAt, right.createdAt);
}
