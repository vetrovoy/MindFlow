import { useCopy, useLanguage } from "@/app/providers/language-provider";
import { MetaText, Modal, IconButton } from "@/shared/ui";
import { useProjectEditForm } from "./model/use-project-edit-form";
import { formatProjectDeadlineLabel } from "./model/project-edit.view";
import { ProjectEditMain } from "./ui/project-edit-main";
import styles from "./index.module.css";

export function ProjectEditFeature() {
  const copy = useCopy();
  const { language } = useLanguage();
  const {
    actions,
    color,
    deadline,
    handleClose,
    isFavorite,
    name,
    nameError,
    project,
    projectId,
    projectSummary,
    setColor,
    setDeadline,
    setFavorite,
    setName,
    state
  } = useProjectEditForm();

  if (project == null || projectSummary == null) {
    return null;
  }

  const remainingCount = Math.max(
    projectSummary.progress.total - projectSummary.progress.done,
    0
  );
  const deadlineLabel = formatProjectDeadlineLabel(copy, language, deadline);

  return (
    <Modal
      contentClassName={styles.modalContent}
      onClose={() => {
        void handleClose();
      }}
      open
      showHandle={false}
    >
      <div className={styles.root}>
        <div className={styles.headerBar}>
          <div className={styles.headerMeta}>
            <MetaText>{copy.project.editTitle}</MetaText>
          </div>
          <IconButton
            ariaLabel={copy.project.editCloseAriaLabel}
            icon="close"
            onClick={() => {
              void handleClose();
            }}
            variant="secondary"
          />
        </div>

        <div className={styles.content}>
          <ProjectEditMain
            actions={actions}
            color={color}
            deadline={deadline}
            deadlineLabel={deadlineLabel}
            isFavorite={isFavorite}
            name={name}
            nameError={nameError}
            onColorChange={setColor}
            onDeadlineChange={setDeadline}
            onFavoriteChange={setFavorite}
            onNameChange={setName}
            progressDone={projectSummary.progress.done}
            progressTotal={projectSummary.progress.total}
            projectId={projectId}
            remainingCount={remainingCount}
            state={state}
          />
        </div>
      </div>
    </Modal>
  );
}
