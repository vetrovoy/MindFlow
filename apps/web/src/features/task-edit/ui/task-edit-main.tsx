import type { Project, TaskPriority, TaskStatus } from "@mindflow/domain";

import {
  ConfirmDialog,
  DatePickerField,
  IconButton,
  MetaText,
  RadioCardGroup,
  SelectField,
  TextAreaField,
  TextField
} from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import {
  INBOX_SELECT_VALUE,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS
} from "../model/task-edit.constants";
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
  const projectLabel = selectedProject?.name ?? "Входящие";
  const priorityLabel = getTaskPriorityLabel(priority);
  const statusLabel = getTaskStatusLabel(status);

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
            placeholder="Что именно нужно сделать?"
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
                getTaskDueDateChipToneClass(dueDateLabel)
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
        placeholder="Описание, детали или следующий шаг"
        value={description}
      />

      <div className={styles.toolbar}>
        <TaskDockPopover iconName="nav-lists" triggerLabel="Изменить список">
          <div className={styles.popoverBody}>
            <SelectField
              ariaLabelledBy="task-edit-project-label"
              className={styles.select}
              contentClassName={styles.selectContent}
              id="task-edit-project"
              onValueChange={onProjectChange}
              options={[
                { value: INBOX_SELECT_VALUE, label: "Входящие" },
                ...activeProjects.map((project) => ({
                  value: project.id,
                  label: project.name
                }))
              ]}
              placeholder="Выберите список"
              value={projectId}
            />
          </div>
        </TaskDockPopover>

        <TaskDockPopover iconName="today" triggerLabel="Изменить срок">
          <div className={styles.popoverBody}>
            <DatePickerField
              ariaLabelledBy="task-edit-due-date-label"
              id="task-edit-due-date"
              onChange={onDueDateChange}
              placeholder="Выберите дату"
              value={dueDate}
            />
          </div>
        </TaskDockPopover>

        <TaskDockPopover
          iconName={getTaskPriorityIconName(priority)}
          triggerLabel={`Приоритет: ${priorityLabel}`}
        >
          <div className={styles.popoverBody}>
            <RadioCardGroup
              ariaLabel="Приоритет задачи"
              className={styles.compactRadioGroup}
              onValueChange={onPriorityChange}
              options={PRIORITY_OPTIONS}
              value={priority}
            />
          </div>
        </TaskDockPopover>

        <TaskDockPopover
          iconName={getTaskStatusIconName(status)}
          triggerLabel={`Статус: ${statusLabel}`}
        >
          <div className={styles.popoverBody}>
            <RadioCardGroup
              ariaLabel="Статус задачи"
              className={styles.compactRadioGroup}
              onValueChange={onStatusChange}
              options={STATUS_OPTIONS}
              value={status}
            />
          </div>
        </TaskDockPopover>

        <TaskDockPopover iconName="more" triggerLabel="Дополнительные действия">
          <div className={styles.menuBody}>
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
                  className={styles.menuAction}
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
