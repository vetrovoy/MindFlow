import { MetaText, Modal, StatusPill, IconButton } from "@/shared/ui";
import { useProjectEditForm } from "./model/use-project-edit-form";
import { formatProjectDeadlineLabel } from "./model/project-edit.view";
import { ProjectEditMain } from "./ui/project-edit-main";
import styles from "./index.module.css";

export function ProjectEditFeature() {
  const {
    actions,
    clearErrors,
    color,
    control,
    deadline,
    errors,
    handleClose,
    isFavorite,
    project,
    projectId,
    projectSummary,
    setValue,
    state
  } = useProjectEditForm();

  if (project == null || projectSummary == null) {
    return null;
  }

  const remainingCount = Math.max(
    projectSummary.progress.total - projectSummary.progress.done,
    0
  );
  const deadlineLabel = formatProjectDeadlineLabel(deadline);

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
            <MetaText>Редактировать список</MetaText>
            {isFavorite ? <StatusPill label="Избранное" variant="today" /> : null}
          </div>
          <IconButton
            ariaLabel="Закрыть редактирование списка"
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
            clearErrors={clearErrors}
            color={color}
            control={control}
            deadlineLabel={deadlineLabel}
            errors={errors}
            isFavorite={isFavorite}
            progressDone={projectSummary.progress.done}
            progressTotal={projectSummary.progress.total}
            projectId={projectId}
            remainingCount={remainingCount}
            setFavorite={(next) => {
              setValue("isFavorite", next, { shouldDirty: true });
            }}
            state={state}
          />
        </div>
      </div>
    </Modal>
  );
}
