import { useCopy } from "@/app/providers/language-provider";
import { IconButton, MetaText, Modal } from "@/shared/ui";
import { useTaskEditForm } from "./model/use-task-edit-form";
import { TaskEditMain } from "./ui/task-edit-main";
import styles from "./index.module.css";

export function TaskEditFeature() {
  const copy = useCopy();
  const {
    activeProjects,
    description,
    dueDate,
    dueDateLabel,
    handleArchiveTask,
    handleClose,
    handleDeleteTask,
    priority,
    projectId,
    selectedProject,
    setDescription,
    setDueDate,
    setPriority,
    setProjectId,
    setStatus,
    state,
    status,
    task,
    title,
    titleError,
    setTitle
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
            <MetaText>{copy.task.editTitle}</MetaText>
          </div>
          <IconButton
            ariaLabel={copy.task.editCloseAriaLabel}
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
            description={description}
            dueDate={dueDate}
            dueDateLabel={dueDateLabel}
            isSaving={state.isSaving}
            onArchiveTask={handleArchiveTask}
            onDescriptionChange={setDescription}
            onDeleteTask={handleDeleteTask}
            onDueDateChange={setDueDate}
            onPriorityChange={setPriority}
            onProjectChange={setProjectId}
            onStatusChange={setStatus}
            onTitleChange={setTitle}
            priority={priority}
            projectId={projectId}
            selectedProject={selectedProject}
            status={status}
            title={title}
            titleError={titleError}
          />
        </div>
      </div>
    </Modal>
  );
}
