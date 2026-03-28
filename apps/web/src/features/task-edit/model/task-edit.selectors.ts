import type { Project } from "@mindflow/domain";

export function getTaskEditSelectedProject(
  activeProjects: Project[],
  projectId: string
) {
  return activeProjects.find((project) => project.id === projectId) ?? null;
}
