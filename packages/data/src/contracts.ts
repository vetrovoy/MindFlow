import type { Project, Task } from "@mindflow/domain";

export interface TaskRepository {
  getById(id: string): Promise<Task | null>;
  listAll(): Promise<Task[]>;
  listActive(): Promise<Task[]>;
  listArchived(): Promise<Task[]>;
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
  push(): Promise<void>;
  pull(): Promise<void>;
}

export interface RepositoryBundle {
  tasks: TaskRepository;
  projects: ProjectRepository;
  transaction: Transaction;
  sync: SyncPort;
}
