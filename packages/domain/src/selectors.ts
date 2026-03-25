import type { Project, Task, TodayTaskGroup } from "./entities";
import { compareTasksWithinMixedFeed } from "./sort";

const TODAY_BUCKET_ORDER = {
  overdue: 0,
  "due-today": 1,
  "high-priority-inbox": 2
} as const;

export function isTaskArchived(task: Task) {
  return task.archivedAt != null;
}

export function isProjectArchived(project: Project) {
  return project.archivedAt != null;
}

export function isTaskDone(task: Task) {
  return task.status === "done";
}

export function isTaskActive(task: Task) {
  return !isTaskArchived(task) && !isTaskDone(task);
}

export function getProjectProgress(tasks: Task[], projectId: string) {
  const visibleTasks = tasks.filter(
    (task) => task.projectId === projectId && !isTaskArchived(task)
  );

  const done = visibleTasks.filter((task) => task.status === "done").length;
  const total = visibleTasks.length;

  return {
    done,
    total,
    ratio: total === 0 ? 0 : done / total
  };
}

export function buildTodayFeed(tasks: Task[], today: string): TodayTaskGroup[] {
  const grouped = tasks.flatMap<TodayTaskGroup>((task) => {
    if (!isTaskActive(task)) {
      return [];
    }

    if (task.dueDate != null && task.dueDate < today) {
      return [{ bucket: "overdue", task }];
    }

    if (task.dueDate === today) {
      return [{ bucket: "due-today", task }];
    }

    if (task.projectId == null && task.priority === "high") {
      return [{ bucket: "high-priority-inbox", task }];
    }

    return [];
  });

  return grouped.sort((left, right) => {
    const bucketResult =
      TODAY_BUCKET_ORDER[left.bucket] - TODAY_BUCKET_ORDER[right.bucket];

    if (bucketResult !== 0) {
      return bucketResult;
    }

    return compareTasksWithinMixedFeed(left.task, right.task);
  });
}

export function searchEntities(
  tasks: Task[],
  projects: Project[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return {
      tasks: [] as Task[],
      projects: [] as Project[]
    };
  }

  return {
    tasks: tasks.filter(
      (task) =>
        !isTaskArchived(task) && task.title.toLowerCase().includes(normalizedQuery)
    ),
    projects: projects.filter(
      (project) =>
        !isProjectArchived(project) &&
        project.name.toLowerCase().includes(normalizedQuery)
    )
  };
}
