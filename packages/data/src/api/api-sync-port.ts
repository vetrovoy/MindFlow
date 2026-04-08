import type { Project, Task } from "@mindflow/domain";
import type { SyncPort } from "../contracts";
import { apiGet } from "./api-client";

/**
 * SyncPort implementation for API-based repositories.
 *
 * - pull(): Fetches all tasks and projects from the server.
 * - push(): No-op for now — will be implemented with pending
 *   changes tracking in VET-103 (offline-first sync).
 */
export class ApiSyncPort implements SyncPort {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly onSyncComplete?: (data: {
      tasks: Task[];
      projects: Project[];
    }) => void
  ) {}

  async pull(): Promise<void> {
    const [tasks, projects] = await Promise.all([
      apiGet<Task[]>(this.baseUrl, "/api/tasks", this.token).catch(() => []),
      apiGet<Project[]>(this.baseUrl, "/api/projects", this.token).catch(
        () => []
      )
    ]);

    this.onSyncComplete?.({ tasks, projects });
  }

  async push(): Promise<void> {
    // No-op for now — pending changes tracking will be added in VET-103
  }
}
