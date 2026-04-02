import type { Project } from "@mindflow/domain";

import { useCopy } from "@/app/providers/language-provider";
import { ProjectBadge } from "@/shared/ui";
import { Body, Title } from "@/shared/ui/typography";
import { IconButton } from "@/shared/ui/primitives";
import styles from "./index.module.css";

interface ArchivedProjectRowProps {
  project: Project;
  taskCount: number;
  onRestore: (projectId: string) => void;
}

export function ArchivedProjectRow({
  onRestore,
  project,
  taskCount
}: ArchivedProjectRowProps) {
  const copy = useCopy();

  return (
    <div className={styles.row}>
      <div className={styles.rowContent}>
        <div className={styles.projectIdentity}>
          <ProjectBadge color={project.color} />
          <div className={styles.projectText}>
            <Title as="h3" className={styles.rowTitle}>
              {project.name}
            </Title>
            <div className={styles.metaRow}>
              <Body className={styles.metaValue}>{copy.project.taskCount(taskCount)}</Body>
              <span className={styles.metaDivider} />
              <Body className={styles.metaValue}>
                {project.deadline == null
                  ? copy.project.noDeadline
                  : copy.project.deadlineLabel(project.deadline)}
              </Body>
            </div>
          </div>
        </div>
      </div>
      <IconButton
        ariaLabel={copy.common.restore}
        className={styles.restoreButton}
        icon="restore"
        iconTone="accent"
        onClick={() => {
          onRestore(project.id);
        }}
        variant="secondary"
      />
    </div>
  );
}
