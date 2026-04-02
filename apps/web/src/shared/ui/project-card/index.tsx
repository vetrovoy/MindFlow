import { useCopy } from "@/app/providers/language-provider";
import { Icon } from "@/shared/ui/icons";
import type { Project, Task } from "@mindflow/domain";

import { ProgressBar } from "@/shared/ui/primitives";
import { ProjectBadge } from "@/shared/ui/project-badge";
import { MetaText, Title } from "@/shared/ui/typography";
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

export function ProjectCard({
  onOpenProject,
  progress,
  project,
  tasks
}: ProjectCardProps) {
  const copy = useCopy();
  const total = progress.total || tasks.length || 0;
  const progressLabel = copy.project.progressLabel(progress.done, total);

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
            <div className={styles.titleRow}>
              <Title as="h3" className={styles.title}>
                {project.name}
              </Title>
              {project.isFavorite ? (
                <span className={styles.favoriteMark}>
                  <Icon name="favorite" size={12} tone="accent" />
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles.trailing}>
          <MetaText as="strong" className={styles.count}>
            {progressLabel}
          </MetaText>
        </div>
      </div>
      <div className={styles.progress}>
        <ProgressBar max={Math.max(total, 1)} value={progress.done} />
      </div>
    </button>
  );
}
