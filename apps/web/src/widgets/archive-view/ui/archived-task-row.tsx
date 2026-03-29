import type { Project, Task } from "@mindflow/domain";

import { useCopy } from "@/app/providers/language-provider";
import { ProjectBadge } from "@/shared/ui";
import { Body, Title } from "@/shared/ui/typography";
import { IconButton } from "@/shared/ui/primitives";
import styles from "./archive-row.module.css";

interface ArchivedTaskRowProps {
  project: Project | null;
  task: Task;
  onRestore: (taskId: string) => void;
}

export function ArchivedTaskRow({
  onRestore,
  project,
  task
}: ArchivedTaskRowProps) {
  const copy = useCopy();

  return (
    <div className={styles.row}>
      <div className={styles.rowContent}>
        <Title as="h3" className={styles.rowTitle}>
          {task.title}
        </Title>
        <div className={styles.metaRow}>
          {project == null ? (
            <Body className={styles.metaValue}>{copy.task.inbox}</Body>
          ) : (
            <ProjectBadge color={project.color} label={project.name} />
          )}
          {task.status === "done" ? (
            <span className={styles.metaPill}>{copy.status.done}</span>
          ) : null}
        </div>
      </div>
      <IconButton
        ariaLabel={copy.task.restoreAriaLabel}
        className={styles.restoreButton}
        icon="restore"
        iconTone="lime"
        onClick={() => {
          onRestore(task.id);
        }}
        variant="secondary"
      />
    </div>
  );
}
