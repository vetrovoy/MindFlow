import type { Project } from "@mindflow/domain";

export function getTaskEditSelectedProject(
  activeProjects: Project[],
  projectId: string
) {
  return activeProjects.find((project) => project.id === projectId) ?? null;
}

export function getTaskEditDueDateLabel(dueDate: string) {
  return dueDate
    ? new Date(`${dueDate}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "Без срока";
}
