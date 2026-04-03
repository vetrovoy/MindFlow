import Dexie, { type Table } from "dexie";

import type { Project, Task } from "@mindflow/domain";
import { validateProject, validateTask } from "@mindflow/domain";

import type {
  ProjectRepository,
  RepositoryBundle,
  SyncPort,
  TaskRepository,
  Transaction
} from "../contracts";

class TaskDatabase extends Dexie {
  tasks!: Table<Task, string>;
  projects!: Table<Project, string>;

  constructor(name: string) {
    super(name);

    this.version(1).stores({
      tasks:
        "id, archivedAt, status, projectId, dueDate, orderIndex, createdAt, updatedAt",
      projects: "id, archivedAt, isFavorite, deadline, createdAt, updatedAt"
    });

    this.version(2).stores({
      tasks:
        "id, archivedAt, status, projectId, dueDate, orderIndex, createdAt, updatedAt",
      projects: "id, archivedAt, isFavorite, deadline, createdAt, updatedAt"
    });
  }
}

function sortByCreatedAtAsc<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

class DexieTaskRepository implements TaskRepository {
  constructor(private readonly database: TaskDatabase) {}

  async getById(id: string) {
    const task = await this.database.tasks.get(id);
    return task == null ? null : validateTask(task);
  }

  async listAll() {
    const tasks = await this.database.tasks.toArray();
    return sortByCreatedAtAsc(tasks).map(validateTask);
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
    await this.database.tasks.delete(id);
  }

  async save(task: Task) {
    const next = validateTask(task);
    await this.database.tasks.put(next);
    return next;
  }

  async saveMany(tasks: Task[]) {
    const nextTasks = tasks.map(validateTask);
    await this.database.tasks.bulkPut(nextTasks);
    return nextTasks;
  }
}

class DexieProjectRepository implements ProjectRepository {
  constructor(private readonly database: TaskDatabase) {}

  async getById(id: string) {
    const project = await this.database.projects.get(id);
    return project == null ? null : validateProject(project);
  }

  async listAll() {
    const projects = await this.database.projects.toArray();
    return sortByCreatedAtAsc(projects).map(validateProject);
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
    await this.database.projects.put(next);
    return next;
  }

  async saveMany(projects: Project[]) {
    const nextProjects = projects.map(validateProject);
    await this.database.projects.bulkPut(nextProjects);
    return nextProjects;
  }
}

class DexieTransaction implements Transaction {
  constructor(private readonly database: TaskDatabase) {}

  async run<T>(work: () => Promise<T>) {
    return this.database.transaction("rw", this.database.tasks, this.database.projects, work);
  }
}

class NoopSyncPort implements SyncPort {
  async push() {}

  async pull() {}
}

export function createDexieRepositoryBundle(
  options?: Partial<{
    name: string;
  }>
): RepositoryBundle {
  const database = new TaskDatabase(options?.name ?? "planner-local");

  return {
    tasks: new DexieTaskRepository(database),
    projects: new DexieProjectRepository(database),
    transaction: new DexieTransaction(database),
    sync: new NoopSyncPort()
  };
}
