import {
  IconButton,
  MetaText,
  Modal,
  StatusPill
} from "@/shared/ui";
import { useTaskEditForm } from "./model/use-task-edit-form";
import { TaskEditMain } from "./ui/task-edit-main";
import styles from "./index.module.css";

export function TaskEditFeature() {
  const {
    activeProjects,
    clearErrors,
    control,
    dueDateLabel,
    errors,
    handleArchiveTask,
    handleClose,
    handleDeleteTask,
    priority,
    selectedProject,
    setPriority,
    setStatus,
    state,
    status,
    task
  } = useTaskEditForm();

  if (task == null) {
    return null;
  }

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
            <MetaText>Редактировать задачу</MetaText>
            {status === "done" ? <StatusPill label="Готово" variant="today" /> : null}
          </div>
          <IconButton
            ariaLabel="Закрыть редактирование задачи"
            icon="close"
            onClick={() => {
              void handleClose();
            }}
            variant="secondary"
          />
        </div>

        <div className={styles.content}>
          <TaskEditMain
            activeProjects={activeProjects}
            clearErrors={clearErrors}
            control={control}
            dueDateLabel={dueDateLabel}
            errors={errors}
            isSaving={state.isSaving}
            onArchiveTask={handleArchiveTask}
            onDeleteTask={handleDeleteTask}
            onPriorityChange={setPriority}
            onStatusChange={setStatus}
            priority={priority}
            selectedProject={selectedProject}
            status={status}
          />
        </div>
      </div>
    </Modal>
  );
}
