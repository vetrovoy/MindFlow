import type { Project } from "@mindflow/domain";
import { validateProject } from "@mindflow/domain";
import type { ProjectRepository } from "../contracts";
import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

export class ApiProjectRepository implements ProjectRepository {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
  ) {}

  async getById(id: string): Promise<Project | null> {
    try {
      const project = await apiGet<Project>(
        this.baseUrl,
        `/api/projects/${id}`,
        this.token
      );
      return validateProject(project);
    } catch {
      return null;
    }
  }

  async listAll(): Promise<Project[]> {
    try {
      const projects = await apiGet<Project[]>(
        this.baseUrl,
        "/api/projects",
        this.token
      );
      return projects.map(validateProject);
    } catch {
      return [];
    }
  }

  async listActive(): Promise<Project[]> {
    const projects = await this.listAll();
    return projects.filter((p) => p.archivedAt == null);
  }

  async listArchived(): Promise<Project[]> {
    const projects = await this.listAll();
    return projects.filter((p) => p.archivedAt != null);
  }

  async save(project: Project): Promise<Project> {
    const validated = validateProject(project);
    const existing = await this.getById(validated.id);
    const result =
      existing == null
        ? await apiPost<Project>(
            this.baseUrl,
            "/api/projects",
            validated,
            this.token
          )
        : await apiPut<Project>(
            this.baseUrl,
            `/api/projects/${validated.id}`,
            validated,
            this.token
          );
    return validateProject(result);
  }

  async saveMany(projects: Project[]): Promise<Project[]> {
    return Promise.all(projects.map((p) => this.save(p)));
  }

  async delete(id: string): Promise<void> {
    await apiDelete(this.baseUrl, `/api/projects/${id}`, this.token);
  }
}
