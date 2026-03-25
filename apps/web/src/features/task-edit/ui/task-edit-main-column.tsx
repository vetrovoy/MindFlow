import type { Project, TaskPriority, TaskStatus } from "@mindflow/domain";
import type { Control, FieldErrors, UseFormClearErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  DatePickerField,
  EditorSection,
  MetaText,
  RadioCardGroup,
  SelectField,
  TextAreaField,
  TextField
} from "@/shared/ui";
import {
  INBOX_SELECT_VALUE,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type TaskEditFormValues
} from "../model/task-edit.constants";
import styles from "../index.module.css";

interface TaskEditMainColumnProps {
  activeProjects: Project[];
  clearErrors: UseFormClearErrors<TaskEditFormValues>;
  control: Control<TaskEditFormValues>;
  errors: FieldErrors<TaskEditFormValues>;
  onPriorityChange: (priority: TaskPriority) => void;
  onStatusChange: (status: TaskStatus) => void;
  priority: TaskPriority;
  status: TaskStatus;
}

export function TaskEditMainColumn({
  activeProjects,
  clearErrors,
  control,
  errors,
  onPriorityChange,
  onStatusChange,
  priority,
  status
}: TaskEditMainColumnProps) {
  return (
    <div className={styles.mainColumn}>
      <EditorSection title="Содержание">
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="task-edit-title">
            Название
          </label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextField
                autoFocus
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
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="task-edit-description">
            Описание
          </label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextAreaField
                id="task-edit-description"
                onChange={(event) => {
                  field.onChange(event.target.value);
                }}
                placeholder="Добавьте детали, ссылки или короткий next step..."
                value={field.value}
              />
            )}
          />
        </div>
        {errors.title?.message == null ? null : (
          <p className={styles.validationMessage}>{errors.title.message}</p>
        )}
      </EditorSection>

      <EditorSection title="План">
        <div className={styles.planningGrid}>
          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
              htmlFor="task-edit-project"
              id="task-edit-project-label"
            >
              Список
            </label>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <SelectField
                  ariaLabelledBy="task-edit-project-label"
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
              )}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
              htmlFor="task-edit-due-date"
              id="task-edit-due-date-label"
            >
              Дата
            </label>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <DatePickerField
                  ariaLabelledBy="task-edit-due-date-label"
                  id="task-edit-due-date"
                  onChange={field.onChange}
                  placeholder="Выберите срок"
                  value={field.value}
                />
              )}
            />
          </div>
        </div>
      </EditorSection>

      <EditorSection title="Статус и приоритет">
        <div className={styles.choiceGrid}>
          <div className={styles.choiceGroup}>
            <MetaText className={styles.choiceLabel}>Приоритет</MetaText>
            <RadioCardGroup
              ariaLabel="Приоритет задачи"
              onValueChange={onPriorityChange}
              options={PRIORITY_OPTIONS}
              value={priority}
            />
          </div>
          <div className={styles.choiceGroup}>
            <MetaText className={styles.choiceLabel}>Статус</MetaText>
            <RadioCardGroup
              ariaLabel="Статус задачи"
              onValueChange={onStatusChange}
              options={STATUS_OPTIONS}
              value={status}
            />
          </div>
        </div>
      </EditorSection>
    </div>
  );
}
