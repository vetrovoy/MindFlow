import {
  Heading,
  MetaText,
  Modal,
  ModalHeader,
  StatusPill
} from "@/shared/ui";
import { useTaskEditForm } from "./model/use-task-edit-form";
import { TaskEditMainColumn } from "./ui/task-edit-main-column";
import { TaskEditSideColumn } from "./ui/task-edit-side-column";
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
      onClose={() => {
        void handleClose();
      }}
      open
    >
      <div className={styles.root}>
        <ModalHeader
          eyebrow={<MetaText>Рабочая задача</MetaText>}
          onClose={() => {
            void handleClose();
          }}
          title={
            <div className={styles.headerTitleWrap}>
              <Heading as="strong" className={styles.headerTitle}>
                Редактирование задачи
              </Heading>
              {status === "done" ? <StatusPill label="Готово" variant="today" /> : null}
            </div>
          }
        />

        <div className={styles.content}>
          <div className={styles.editorGrid}>
            <TaskEditMainColumn
              activeProjects={activeProjects}
              clearErrors={clearErrors}
              control={control}
              errors={errors}
              onPriorityChange={setPriority}
              onStatusChange={setStatus}
              priority={priority}
              status={status}
            />
            <TaskEditSideColumn
              dueDateLabel={dueDateLabel}
              isSaving={state.isSaving}
              onArchiveTask={handleArchiveTask}
              onDeleteTask={handleDeleteTask}
              selectedProject={selectedProject}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
