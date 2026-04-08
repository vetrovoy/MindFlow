import type { Project, Task } from "@mindflow/domain";
import type { SyncPort } from "../contracts";
import { apiGet } from "./api-client";

/**
 * SyncPort implementation for API-based repositories.
 *
 * - pull(): Fetches all tasks and projects from the server and returns them.
 * - push(): No-op for now — will be implemented with pending
 *   changes tracking in VET-104 (offline-first sync).
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
    } catch {
      return null;
    }
  }

  async push(): Promise<void> {
    // No-op for now — pending changes tracking will be added in VET-104
  }
}
