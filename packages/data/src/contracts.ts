import type { Project, Task } from "@mindflow/domain";

export type ChangeType = "created" | "updated" | "deleted";

export interface PendingChange {
  entity: "task" | "project";
  id: string;
  type: ChangeType;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface TaskRepository {
  getById(id: string): Promise<Task | null>;
  listAll(): Promise<Task[]>;
  listActive(): Promise<Task[]>;
  listArchived(): Promise<Task[]>;
  delete(id: string): Promise<void>;
  save(task: Task): Promise<Task>;
  saveMany(tasks: Task[]): Promise<Task[]>;
}

export interface ProjectRepository {
  getById(id: string): Promise<Project | null>;
  listAll(): Promise<Project[]>;
  listActive(): Promise<Project[]>;
  listArchived(): Promise<Project[]>;
  save(project: Project): Promise<Project>;
  saveMany(projects: Project[]): Promise<Project[]>;
}

export interface Transaction {
  run<T>(work: () => Promise<T>): Promise<T>;
}

export interface SyncPort {
  push(change: PendingChange): Promise<void>;
  pull(): Promise<{ tasks: Task[]; projects: Project[] } | null>;
}

export interface RepositoryBundle {
  tasks: TaskRepository;
  projects: ProjectRepository;
  transaction: Transaction;
  sync: SyncPort;
}
