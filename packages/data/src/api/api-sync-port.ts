import type { Project, Task } from "@mindflow/domain";
import type { PendingChange, SyncPort } from "../contracts";
import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

/**
 * SyncPort implementation for API-based repositories.
 *
 * - pull(): Fetches all tasks and projects from the server.
 * - push(): Sends a pending change to the server.
 */
export class ApiSyncPort implements SyncPort {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
  ) {}

  async pull(): Promise<{ tasks: Task[]; projects: Project[] } | null> {
    try {
      const [tasks, projects] = await Promise.all([
        apiGet<Task[]>(this.baseUrl, "/api/tasks", this.token),
        apiGet<Project[]>(this.baseUrl, "/api/projects", this.token)
      ]);
      return { tasks, projects };
    } catch (error) {
      // Re-throw to let caller distinguish between auth failures (401), server errors, and network issues
      if (error instanceof Error && error.message.includes("401")) {
        throw new Error("Unauthorized: token expired or invalid");
      }
      throw error;
    }
  }

  async push(change: PendingChange): Promise<void> {
    const basePath = change.entity === "task" ? "/api/tasks" : "/api/projects";

    switch (change.type) {
      case "created":
        await apiPost(
          this.baseUrl,
          basePath,
          { id: change.id, ...change.data },
          this.token
        );
        break;
      case "updated":
        await apiPut(
          this.baseUrl,
          `${basePath}/${change.id}`,
          change.data ?? {},
          this.token
        );
        break;
      case "deleted":
        await apiDelete(this.baseUrl, `${basePath}/${change.id}`, this.token);
        break;
    }
  }
}
