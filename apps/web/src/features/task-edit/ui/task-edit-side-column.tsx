import type { Project } from "@mindflow/domain";

import {
  ConfirmDialog,
  EditorSection,
  Heading,
  IconButton,
  MetaText,
  ProjectBadge
} from "@/shared/ui";
import styles from "../index.module.css";

interface TaskEditSideColumnProps {
  dueDateLabel: string;
  isSaving: boolean;
  onArchiveTask: () => void;
  onDeleteTask: () => void;
  selectedProject: Project | null;
}

export function TaskEditSideColumn({
  dueDateLabel,
  isSaving,
  onArchiveTask,
  onDeleteTask,
  selectedProject
}: TaskEditSideColumnProps) {
  return (
    <aside className={styles.sideColumn}>
      <EditorSection title="Обзор">
        <div className={styles.summaryCard}>
          <div>
            <MetaText className={styles.summaryLabel}>Список</MetaText>
            {selectedProject == null ? (
              <Heading as="strong" className={styles.summaryValue}>
                Входящие
              </Heading>
            ) : (
              <div className={styles.summaryProject}>
                <ProjectBadge color={selectedProject.color} label={selectedProject.name} />
              </div>
            )}
          </div>
          <div>
            <MetaText className={styles.summaryLabel}>Срок</MetaText>
            <Heading as="strong" className={styles.summaryValue}>
              {dueDateLabel}
            </Heading>
          </div>
        </div>
      </EditorSection>

      <EditorSection title="Действия">
        <div className={styles.actionsRow}>
          <ConfirmDialog
            confirmAriaLabel="Подтвердить архивацию"
            confirmDisabled={isSaving}
            confirmIcon="archive"
            description="Задача исчезнет из активных экранов, но сохранится в архиве локально."
            onConfirm={onArchiveTask}
            title="Подтвердите архивацию"
            trigger={
              <IconButton
                ariaLabel="Архивировать задачу"
                icon="archive"
                variant="secondary"
              />
            }
          />
          <ConfirmDialog
            confirmAriaLabel="Подтвердить удаление"
            confirmDisabled={isSaving}
            confirmIcon="trash"
            confirmTone="alert"
            description="Удаление уберёт задачу из локального плана без возможности восстановить её из активного интерфейса."
            onConfirm={onDeleteTask}
            title="Подтвердите удаление"
            trigger={
              <IconButton
                ariaLabel="Удалить задачу"
                className={styles.deleteButton}
                icon="trash"
                variant="secondary"
              />
            }
          />
        </div>
      </EditorSection>
    </aside>
  );
}
