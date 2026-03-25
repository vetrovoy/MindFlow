import type { Project, Task } from "@mindflow/domain";

export interface TaskRepository {
  listActive(): Promise<Task[]>;
}

export interface ProjectRepository {
  listActive(): Promise<Project[]>;
}

export interface Transaction {
  run<T>(work: () => Promise<T>): Promise<T>;
}

export interface SyncPort {
  push(): Promise<void>;
  pull(): Promise<void>;
}
