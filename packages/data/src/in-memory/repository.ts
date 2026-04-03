import type { Project, Task } from "@mindflow/domain";
import { validateProject, validateTask } from "@mindflow/domain";

import type {
  ProjectRepository,
  RepositoryBundle,
  SyncPort,
  TaskRepository,
  Transaction
} from "../contracts";

class InMemoryTaskRepository implements TaskRepository {
  constructor(private readonly items: Map<string, Task>) {}

  async getById(id: string) {
    return this.items.get(id) ?? null;
  }

  async listAll() {
    return Array.from(this.items.values()).sort((left, right) =>
      left.createdAt.localeCompare(right.createdAt)
    );
  }

  async listActive() {
    const tasks = await this.listAll();

    return tasks.filter((task) => task.archivedAt == null);
  }

  async listArchived() {
    const tasks = await this.listAll();

    return tasks.filter((task) => task.archivedAt != null);
  }

  async delete(id: string) {
    this.items.delete(id);
  }

  async save(task: Task) {
    const next = validateTask(task);
    this.items.set(next.id, next);
    return next;
  }

  async saveMany(tasks: Task[]) {
    return Promise.all(tasks.map((task) => this.save(task)));
  }
}

class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly items: Map<string, Project>) {}

  async getById(id: string) {
    return this.items.get(id) ?? null;
  }

  async listAll() {
    return Array.from(this.items.values()).sort((left, right) =>
      left.createdAt.localeCompare(right.createdAt)
    );
  }

  async listActive() {
    const projects = await this.listAll();

    return projects.filter((project) => project.archivedAt == null);
  }

  async listArchived() {
    const projects = await this.listAll();

    return projects.filter((project) => project.archivedAt != null);
  }

  async save(project: Project) {
    const next = validateProject(project);
    this.items.set(next.id, next);
    return next;
  }

  async saveMany(projects: Project[]) {
    return Promise.all(projects.map((project) => this.save(project)));
  }
}

class InMemoryTransaction implements Transaction {
  async run<T>(work: () => Promise<T>) {
    return work();
  }
}

class NoopSyncPort implements SyncPort {
  async push() {}

  async pull() {}
}

export function createInMemoryRepositoryBundle(
  initial?: Partial<{
    tasks: Task[];
    projects: Project[];
  }>
): RepositoryBundle {
  const taskItems = new Map<string, Task>();
  const projectItems = new Map<string, Project>();

  for (const task of initial?.tasks ?? []) {
    taskItems.set(task.id, validateTask(task));
  }

  for (const project of initial?.projects ?? []) {
    projectItems.set(project.id, validateProject(project));
  }

  return {
    tasks: new InMemoryTaskRepository(taskItems),
    projects: new InMemoryProjectRepository(projectItems),
    transaction: new InMemoryTransaction(),
    sync: new NoopSyncPort()
  };
}
