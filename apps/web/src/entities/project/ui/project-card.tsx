import type { Project, Task } from "@mindflow/domain";

import { ProjectCard } from "@/shared/ui";

interface ProjectCardEntityProps {
  project: Project;
  tasks: Task[];
  progress: {
    done: number;
    total: number;
  };
  onOpenProject?: (projectId: string) => void;
}

export function ProjectCardEntity({
  onOpenProject,
  progress,
  project,
  tasks
}: ProjectCardEntityProps) {
  return (
    <ProjectCard
      onOpenProject={onOpenProject}
      progress={progress}
      project={project}
      tasks={tasks}
    />
  );
}
