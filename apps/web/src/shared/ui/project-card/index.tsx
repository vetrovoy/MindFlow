import type { Project, Task } from "@mindflow/domain";

import { ProgressBar } from "@/shared/ui/primitives";
import { ProjectBadge } from "@/shared/ui/project-badge";
import { Body, MetaText, Title } from "@/shared/ui/typography";
import styles from "./index.module.css";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  progress: {
    done: number;
    total: number;
  };
  onOpenProject?: (projectId: string) => void;
}

function getTaskCountCopy(count: number) {
  if (count === 1) {
    return "задача";
  }

  if (count < 5) {
    return "задачи";
  }

  return "задач";
}

export function ProjectCard({ onOpenProject, progress, project, tasks }: ProjectCardProps) {
  const total = progress.total || tasks.length || 0;

  return (
    <button
      className={styles.card}
      onClick={() => {
        onOpenProject?.(project.id);
      }}
      type="button"
    >
      <div className={styles.header}>
        <div className={styles.identity}>
          <ProjectBadge color={project.color} label="" />
          <div className={styles.textWrap}>
            <Title as="h3" className={styles.title}>
              {project.name}
            </Title>
            <MetaText className={styles.subtitle}>
              {total === 0 ? "0 задач" : `${total} ${getTaskCountCopy(total)}`}
            </MetaText>
          </div>
        </div>
        <MetaText as="strong" className={styles.count}>
          {progress.done}/{Math.max(total, 1)}
        </MetaText>
      </div>
      <div className={styles.progress}>
        <ProgressBar max={Math.max(total, 1)} value={progress.done} />
      </div>
      <Body className={styles.description}>
        {tasks.length === 0
          ? "Готово 0, в работе 0"
          : `Готово ${progress.done}, в работе ${Math.max(total - progress.done, 0)}.`}
      </Body>
    </button>
  );
}
