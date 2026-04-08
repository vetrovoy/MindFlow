import { open, type Scalar } from "@op-engineering/op-sqlite";
import type { Transaction as OPTransaction } from "@op-engineering/op-sqlite";
import type { Project, Task } from "@mindflow/domain";
import { validateProject, validateTask } from "@mindflow/domain";
import type {
  PendingChange,
  ProjectRepository,
  RepositoryBundle,
  SyncPort,
  TaskRepository,
  Transaction
} from "../contracts";

// ─── Schema ──────────────────────────────────────────────────────────────────

const TASKS_DDL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id         TEXT    PRIMARY KEY NOT NULL,
    title      TEXT    NOT NULL,
    description TEXT,
    status     TEXT    NOT NULL DEFAULT 'todo',
    priority   TEXT    NOT NULL DEFAULT 'medium',
    dueDate    TEXT,
    projectId  TEXT,
    orderIndex REAL    NOT NULL DEFAULT 0,
    createdAt  TEXT    NOT NULL,
    updatedAt  TEXT    NOT NULL,
    completedAt TEXT,
    archivedAt  TEXT
  )
`;

const PROJECTS_DDL = `
  CREATE TABLE IF NOT EXISTS projects (
    id          TEXT    PRIMARY KEY NOT NULL,
    name        TEXT    NOT NULL,
    color       TEXT    NOT NULL,
    emoji       TEXT    NOT NULL,
    isFavorite  INTEGER NOT NULL DEFAULT 0,
    deadline    TEXT,
    createdAt   TEXT    NOT NULL,
    updatedAt   TEXT    NOT NULL,
    archivedAt  TEXT
  )
`;

// ─── Row mappers ─────────────────────────────────────────────────────────────

function rowToTask(row: Record<string, unknown>): Task {
  return validateTask({
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    status: row.status as Task["status"],
    priority: row.priority as Task["priority"],
    dueDate: (row.dueDate as string | null) ?? null,
    projectId: (row.projectId as string | null) ?? null,
    orderIndex: Number(row.orderIndex ?? 0),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
    completedAt: (row.completedAt as string | null) ?? null,
    archivedAt: (row.archivedAt as string | null) ?? null
  });
}

function rowToProject(row: Record<string, unknown>): Project {
  return validateProject({
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
    emoji: row.emoji as string,
    isFavorite: row.isFavorite === 1 || row.isFavorite === true,
    deadline: (row.deadline as string | null) ?? null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
    archivedAt: (row.archivedAt as string | null) ?? null
  });
}

function taskToParams(task: Task): Scalar[] {
  return [
    task.id,
    task.title,
    task.description,
    task.status,
    task.priority,
    task.dueDate,
    task.projectId,
    task.orderIndex,
    task.createdAt,
    task.updatedAt,
    task.completedAt ?? null,
    task.archivedAt ?? null
  ];
}

function projectToParams(project: Project): Scalar[] {
  return [
    project.id,
    project.name,
    project.color,
    project.emoji,
    project.isFavorite ? 1 : 0,
    project.deadline,
    project.createdAt,
    project.updatedAt,
    project.archivedAt ?? null
  ];
}

// ─── Repositories ─────────────────────────────────────────────────────────────

type ExecFn = (
  query: string,
  params?: Scalar[]
) => Promise<{ rows: Record<string, unknown>[] }>;

class SqliteTaskRepository implements TaskRepository {
  constructor(private readonly exec: ExecFn) {}

  async getById(id: string): Promise<Task | null> {
    const { rows } = await this.exec("SELECT * FROM tasks WHERE id = ?", [id]);
    return rows.length > 0 ? rowToTask(rows[0]) : null;
  }

  async listAll(): Promise<Task[]> {
    const { rows } = await this.exec(
      "SELECT * FROM tasks ORDER BY createdAt ASC"
    );
    return rows.map(rowToTask);
  }

  async listActive(): Promise<Task[]> {
    const { rows } = await this.exec(
      "SELECT * FROM tasks WHERE archivedAt IS NULL ORDER BY createdAt ASC"
    );
    return rows.map(rowToTask);
  }

  async listArchived(): Promise<Task[]> {
    const { rows } = await this.exec(
      "SELECT * FROM tasks WHERE archivedAt IS NOT NULL ORDER BY createdAt ASC"
    );
    return rows.map(rowToTask);
  }

  async save(task: Task): Promise<Task> {
    const validated = validateTask(task);
    await this.exec(
      `INSERT OR REPLACE INTO tasks
        (id, title, description, status, priority, dueDate, projectId,
         orderIndex, createdAt, updatedAt, completedAt, archivedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      taskToParams(validated)
    );
    return validated;
  }

  async saveMany(tasks: Task[]): Promise<Task[]> {
    return Promise.all(tasks.map((t) => this.save(t)));
  }

  async delete(id: string): Promise<void> {
    await this.exec("DELETE FROM tasks WHERE id = ?", [id]);
  }
}

class SqliteProjectRepository implements ProjectRepository {
  constructor(private readonly exec: ExecFn) {}

  async getById(id: string): Promise<Project | null> {
    const { rows } = await this.exec("SELECT * FROM projects WHERE id = ?", [
      id
    ]);
    return rows.length > 0 ? rowToProject(rows[0]) : null;
  }

  async listAll(): Promise<Project[]> {
    const { rows } = await this.exec(
      "SELECT * FROM projects ORDER BY createdAt ASC"
    );
    return rows.map(rowToProject);
  }

  async listActive(): Promise<Project[]> {
    const { rows } = await this.exec(
      "SELECT * FROM projects WHERE archivedAt IS NULL ORDER BY createdAt ASC"
    );
    return rows.map(rowToProject);
  }

  async listArchived(): Promise<Project[]> {
    const { rows } = await this.exec(
      "SELECT * FROM projects WHERE archivedAt IS NOT NULL ORDER BY createdAt ASC"
    );
    return rows.map(rowToProject);
  }

  async save(project: Project): Promise<Project> {
    const validated = validateProject(project);
    await this.exec(
      `INSERT OR REPLACE INTO projects
        (id, name, color, emoji, isFavorite, deadline, createdAt, updatedAt, archivedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      projectToParams(validated)
    );
    return validated;
  }

  async saveMany(projects: Project[]): Promise<Project[]> {
    return Promise.all(projects.map((p) => this.save(p)));
  }
}

// ─── Transaction ──────────────────────────────────────────────────────────────

class SqliteTransactionWrapper implements Transaction {
  constructor(
    private readonly db: ReturnType<typeof open>,
    private readonly exec: ExecFn
  ) {}

  async run<T>(work: () => Promise<T>): Promise<T> {
    let hasResult = false;
    let result: T | undefined;
    await this.db.transaction(async (_tx: OPTransaction) => {
      result = await work();
      hasResult = true;
    });
    if (!hasResult) {
      throw new Error(
        "SQLite transaction completed without returning a result"
      );
    }
    return result as T;
  }
}

// ─── Noop sync ────────────────────────────────────────────────────────────────

class NoopSyncPort implements SyncPort {
  async push(_change: PendingChange): Promise<void> {}
  async pull(): Promise<null> {
    return null;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createSqliteRepositoryBundle(options: {
  name: string;
}): RepositoryBundle {
  const db = open({ name: `${options.name}.sqlite` });

  // Create tables synchronously at startup
  db.executeSync(TASKS_DDL);
  db.executeSync(PROJECTS_DDL);

  // Async exec wrapper that returns rows as plain array
  const exec: ExecFn = async (query, params) => {
    const result = await db.execute(query, params);
    return { rows: result.rows as Record<string, unknown>[] };
  };

  return {
    tasks: new SqliteTaskRepository(exec),
    projects: new SqliteProjectRepository(exec),
    transaction: new SqliteTransactionWrapper(db, exec),
    sync: new NoopSyncPort()
  };
}
