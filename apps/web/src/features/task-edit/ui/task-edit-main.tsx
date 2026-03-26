import type { Project, TaskPriority, TaskStatus } from "@mindflow/domain";
import type { Control, FieldErrors, UseFormClearErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

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
  STATUS_OPTIONS,
  type TaskEditFormValues
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
  clearErrors: UseFormClearErrors<TaskEditFormValues>;
  control: Control<TaskEditFormValues>;
  dueDateLabel: string;
  errors: FieldErrors<TaskEditFormValues>;
  isSaving: boolean;
  onArchiveTask: () => void;
  onDeleteTask: () => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onStatusChange: (status: TaskStatus) => void;
  priority: TaskPriority;
  selectedProject: Project | null;
  status: TaskStatus;
}

export function TaskEditMain({
  activeProjects,
  clearErrors,
  control,
  dueDateLabel,
  errors,
  isSaving,
  onArchiveTask,
  onDeleteTask,
  onPriorityChange,
  onStatusChange,
  priority,
  selectedProject,
  status
}: TaskEditMainProps) {
  const projectLabel = selectedProject?.name ?? "Входящие";
  const priorityLabel = getTaskPriorityLabel(priority);
  const statusLabel = getTaskStatusLabel(status);

  return (
    <div className={styles.mainColumn}>
      <div className={styles.hero}>
        <div className={styles.titleRow}>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextField
                autoFocus
                className={styles.titleField}
                id="task-edit-title"
                onChange={(event) => {
                  field.onChange(event.target.value);
                  if (errors.title != null) {
                    clearErrors("title");
                  }
                }}
                placeholder="Что именно нужно сделать?"
                value={field.value}
              />
            )}
          />
          {errors.title?.message == null ? null : (
            <p className={styles.validationMessage}>{errors.title.message}</p>
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

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextAreaField
            className={styles.descriptionField}
            id="task-edit-description"
            onChange={(event) => {
              field.onChange(event.target.value);
            }}
            placeholder="Описание, детали или следующий шаг"
            value={field.value}
          />
        )}
      />

      <div className={styles.toolbar}>
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <TaskDockPopover
              iconName="nav-lists"
              triggerLabel="Изменить список"
            >
              <div className={styles.popoverBody}>
                <MetaText className={styles.popoverLabel}>Список</MetaText>
                <SelectField
                  ariaLabelledBy="task-edit-project-label"
                  contentClassName={styles.selectContent}
                  id="task-edit-project"
                  onValueChange={field.onChange}
                  options={[
                    { value: INBOX_SELECT_VALUE, label: "Входящие" },
                    ...activeProjects.map((project) => ({
                      value: project.id,
                      label: project.name
                    }))
                  ]}
                  placeholder="Выберите список"
                  value={field.value}
                />
              </div>
            </TaskDockPopover>
          )}
        />

        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <TaskDockPopover iconName="today" triggerLabel="Изменить срок">
              <div className={styles.popoverBody}>
                <MetaText className={styles.popoverLabel}>Срок</MetaText>
                <DatePickerField
                  ariaLabelledBy="task-edit-due-date-label"
                  id="task-edit-due-date"
                  onChange={field.onChange}
                  placeholder="Выберите срок"
                  value={field.value}
                />
              </div>
            </TaskDockPopover>
          )}
        />

        <TaskDockPopover
          iconName={getTaskPriorityIconName(priority)}
          triggerLabel={`Приоритет: ${priorityLabel}`}
        >
          <div className={styles.popoverBody}>
            <MetaText className={styles.popoverLabel}>Приоритет</MetaText>
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
            <MetaText className={styles.popoverLabel}>Статус</MetaText>
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
                  className={cn(styles.menuAction, styles.deleteButton)}
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
