export type TaskStatus = "todo" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  archivedAt?: string | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  emoji: string;
  isFavorite: boolean;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface TaskCreateInput {
  id: string;
  title: string;
  now: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  projectId?: string | null;
  orderIndex?: number;
}

export interface ProjectCreateInput {
  id: string;
  name: string;
  color: string;
  emoji: string;
  now: string;
  isFavorite?: boolean;
  deadline?: string | null;
}

export interface TodayTaskGroup {
  bucket: "overdue" | "due-today" | "high-priority-inbox";
  task: Task;
}
