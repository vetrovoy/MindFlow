import type { Project, TaskPriority, TaskStatus } from "@mindflow/domain";

import { useCopy } from "@/app/providers/language-provider";
import {
  ConfirmDialog,
  DatePickerField,
  DockIconButton,
  IconButton,
  MetaText,
  RadioCardGroup,
  SelectField,
  TextAreaField,
  TextField
} from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { INBOX_SELECT_VALUE } from "../model/task-edit.constants";
import {
  getTaskDueDateChipToneClass,
  getTaskPriorityIconName,
  getTaskPriorityLabel,
  getTaskStatusIconName,
  getTaskStatusLabel
} from "../model/task-edit.view";
import styles from "../index.module.css";
import { TaskDockPopover } from "./task-dock-popover";

interface TaskEditMainProps {
  activeProjects: Project[];
  description: string;
  dueDate: string;
  dueDateLabel: string;
  isSaving: boolean;
  onArchiveTask: () => void;
  onDeleteTask: () => void;
  onDescriptionChange: (description: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onProjectChange: (projectId: string) => void;
  onStatusChange: (status: TaskStatus) => void;
  onTitleChange: (title: string) => void;
  priority: TaskPriority;
  projectId: string;
  selectedProject: Project | null;
  status: TaskStatus;
  title: string;
  titleError: string | null;
}

export function TaskEditMain({
  activeProjects,
  description,
  dueDate,
  dueDateLabel,
  isSaving,
  onArchiveTask,
  onDescriptionChange,
  onDeleteTask,
  onDueDateChange,
  onPriorityChange,
  onProjectChange,
  onStatusChange,
  onTitleChange,
  priority,
  projectId,
  selectedProject,
  status,
  title,
  titleError
}: TaskEditMainProps) {
  const copy = useCopy();
  const projectLabel = selectedProject?.name ?? copy.task.inbox;
  const priorityLabel = getTaskPriorityLabel(copy, priority);
  const statusLabel = getTaskStatusLabel(copy, status);
  const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
    { value: "low", label: copy.priority.low },
    { value: "medium", label: copy.priority.medium },
    { value: "high", label: copy.priority.high }
  ];
  return (
    <div className={styles.mainColumn}>
      <div className={styles.hero}>
        <div className={styles.titleRow}>
          <TextField
            autoFocus
            className={styles.titleField}
            id="task-edit-title"
            onChange={(event) => {
              onTitleChange(event.target.value);
            }}
            placeholder={copy.task.titlePlaceholder}
            value={title}
          />
          {titleError == null ? null : (
            <p className={styles.validationMessage}>{titleError}</p>
          )}
          <div className={styles.metaInline}>
            <MetaText className={cn(styles.metaChip, styles.metaChipProject)}>
              {projectLabel}
            </MetaText>
            <MetaText
              className={cn(
                styles.metaChip,
                getTaskDueDateChipToneClass(dueDate)
              )}
            >
              {dueDateLabel}
            </MetaText>
            <MetaText className={cn(styles.metaChip, styles.metaChipPriority)}>
              {priorityLabel}
            </MetaText>
            <MetaText className={cn(styles.metaChip, styles.metaChipStatus)}>
              {statusLabel}
            </MetaText>
          </div>
        </div>
      </div>

      <TextAreaField
        className={styles.descriptionField}
        id="task-edit-description"
        onChange={(event) => {
          onDescriptionChange(event.target.value);
        }}
        placeholder={copy.task.descriptionPlaceholder}
        value={description}
      />

      <div className={styles.toolbar}>
        <TaskDockPopover
          active={projectId !== INBOX_SELECT_VALUE}
          iconName="nav-lists"
          triggerLabel={copy.task.changeProjectTrigger}
        >
          <div className={styles.popoverBody}>
            <SelectField
              ariaLabelledBy="task-edit-project-label"
              className={styles.select}
              contentClassName={styles.selectContent}
              id="task-edit-project"
              onValueChange={onProjectChange}
              options={[
                { value: INBOX_SELECT_VALUE, label: copy.task.inbox },
                ...activeProjects.map((project) => ({
                  value: project.id,
                  label: project.name
                }))
              ]}
              placeholder={copy.editor.selectListPlaceholder}
              value={projectId}
            />
          </div>
        </TaskDockPopover>

        <TaskDockPopover
          active={Boolean(dueDate)}
          iconName="today"
          triggerLabel={copy.task.changeDueDateTrigger}
        >
          <div className={styles.popoverBody}>
            <DatePickerField
              ariaLabelledBy="task-edit-due-date-label"
              id="task-edit-due-date"
              onChange={onDueDateChange}
              placeholder={copy.editor.selectDatePlaceholder}
              value={dueDate}
            />
          </div>
        </TaskDockPopover>

        <TaskDockPopover
          active={priority !== "medium"}
          iconName={getTaskPriorityIconName(priority)}
          triggerLabel={`${copy.task.priorityAriaLabel}: ${priorityLabel}`}
        >
          <div className={styles.popoverBody}>
            <RadioCardGroup
              ariaLabel={copy.task.priorityAriaLabel}
              className={styles.compactRadioGroup}
              onValueChange={onPriorityChange}
              options={priorityOptions}
              value={priority}
            />
          </div>
        </TaskDockPopover>

        <DockIconButton
          active={status !== "todo"}
          aria-label={`${copy.task.statusAriaLabel}: ${statusLabel}`}
          iconName={getTaskStatusIconName(status)}
          onClick={() => {
            onStatusChange(status === "todo" ? "done" : "todo");
          }}
          title={`${copy.task.statusAriaLabel}: ${statusLabel}`}
        />

        <TaskDockPopover iconName="more" triggerLabel={copy.task.moreActionsTrigger}>
          <div className={styles.menuBody}>
            <ConfirmDialog
              confirmAriaLabel={copy.editor.confirmAriaLabel}
              confirmDisabled={isSaving}
              confirmIcon="archive"
              description={copy.task.archiveConfirmDescription}
              onConfirm={onArchiveTask}
              title={copy.task.archiveConfirmTitle}
              trigger={
                <IconButton
                  ariaLabel={copy.task.archiveAriaLabel}
                  className={styles.menuAction}
                  icon="archive"
                  variant="secondary"
                />
              }
            />
            <ConfirmDialog
              confirmAriaLabel={copy.editor.confirmAriaLabel}
              confirmDisabled={isSaving}
              confirmIcon="trash"
              confirmTone="alert"
              description={copy.task.deleteConfirmDescription}
              onConfirm={onDeleteTask}
              title={copy.task.deleteConfirmTitle}
              trigger={
                <IconButton
                  ariaLabel={copy.task.deleteAriaLabel}
                  className={cn(styles.menuAction)}
                  icon="trash"
                  variant="secondary"
                />
              }
            />
          </div>
        </TaskDockPopover>
      </div>
    </div>
  );
}
