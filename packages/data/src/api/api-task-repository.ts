import type { Task } from "@mindflow/domain";
import { validateTask } from "@mindflow/domain";
import type { TaskRepository } from "../contracts";
import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

export class ApiTaskRepository implements TaskRepository {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
  ) {}

  async getById(id: string): Promise<Task | null> {
    try {
      const task = await apiGet<Task>(
        this.baseUrl,
        `/api/tasks/${id}`,
        this.token
      );
      return validateTask(task);
    } catch {
      return null;
    }
  }

  async listAll(): Promise<Task[]> {
    try {
      const tasks = await apiGet<Task[]>(
        this.baseUrl,
        "/api/tasks",
        this.token
      );
      return tasks.map(validateTask);
    } catch {
      return [];
    }
  }

  async listActive(): Promise<Task[]> {
    const tasks = await this.listAll();
    return tasks.filter((t) => t.archivedAt == null);
  }

  async listArchived(): Promise<Task[]> {
    const tasks = await this.listAll();
    return tasks.filter((t) => t.archivedAt != null);
  }

  async save(task: Task): Promise<Task> {
    const validated = validateTask(task);
    // Check if task exists on server — use POST for new, PUT for existing
    const existing = await this.getById(validated.id);
    const result =
      existing == null
        ? await apiPost<Task>(this.baseUrl, "/api/tasks", validated, this.token)
        : await apiPut<Task>(
            this.baseUrl,
            `/api/tasks/${validated.id}`,
            validated,
            this.token
          );
    return validateTask(result);
  }

  async saveMany(tasks: Task[]): Promise<Task[]> {
    return Promise.all(tasks.map((t) => this.save(t)));
  }

  async delete(id: string): Promise<void> {
    await apiDelete(this.baseUrl, `/api/tasks/${id}`, this.token);
  }
}
