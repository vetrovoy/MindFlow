import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  ConfirmDialog,
  DatePickerField,
  EditorSection,
  Heading,
  IconButton,
  MetaText,
  Modal,
  ModalHeader,
  ProjectBadge,
  SelectField,
  StatusPill,
  TextAreaField,
  TextField
} from "@/shared/ui";
import styles from "./index.module.css";

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string; helper: string }> = [
  { value: "low", label: "Низкий", helper: "Позже" },
  { value: "medium", label: "Средний", helper: "В работе" },
  { value: "high", label: "Высокий", helper: "Срочно" }
];

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string; helper: string }> = [
  { value: "todo", label: "В работе", helper: "Активна" },
  { value: "done", label: "Готово", helper: "Завершена" }
];

const INBOX_SELECT_VALUE = "__inbox__";

interface TaskEditFormValues {
  title: string;
  description: string;
  projectId: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

const DEFAULT_VALUES: TaskEditFormValues = {
  title: "",
  description: "",
  projectId: INBOX_SELECT_VALUE,
  dueDate: "",
  priority: "medium",
  status: "todo"
};

export function TaskEditFeature() {
  const { actions, derived, state } = useMindFlowApp();
  const task = derived.editingTask;
  const activeProjects = [...derived.favoriteProjects, ...derived.regularProjects];
  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    reset,
    setError,
    setValue
  } = useForm<TaskEditFormValues>({
    defaultValues: DEFAULT_VALUES
  });
  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "description" }) ?? "";
  const projectId = useWatch({ control, name: "projectId" }) ?? INBOX_SELECT_VALUE;
  const dueDate = useWatch({ control, name: "dueDate" }) ?? "";
  const priority = useWatch({ control, name: "priority" }) ?? "medium";
  const status = useWatch({ control, name: "status" }) ?? "todo";
  const lastSyncedSignatureRef = useRef<string>("");
  const hydratedTaskIdRef = useRef<string | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const taskId = task?.id ?? "";

  useEffect(() => {
    if (task == null) {
      hydratedTaskIdRef.current = null;
      if (autosaveTimeoutRef.current != null) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
      clearErrors();
      reset(DEFAULT_VALUES);
      return;
    }

    if (hydratedTaskIdRef.current === task.id) {
      return;
    }

    const nextValues: TaskEditFormValues = {
      title: task.title,
      description: task.description ?? "",
      projectId: task.projectId ?? INBOX_SELECT_VALUE,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
      status: task.status
    };

    reset(nextValues);
    clearErrors();
    hydratedTaskIdRef.current = task.id;
    lastSyncedSignatureRef.current = JSON.stringify(nextValues);
  }, [clearErrors, reset, task]);

  const draftSignature = useMemo(
    () =>
      JSON.stringify({
        title,
        description,
        projectId,
        dueDate,
        priority,
        status
      }),
    [description, dueDate, priority, projectId, status, title]
  );

  useEffect(() => {
    if (task == null) {
      return;
    }

    if (hydratedTaskIdRef.current !== task.id) {
      return;
    }

    if (draftSignature === lastSyncedSignatureRef.current) {
      return;
    }

    const payload = buildSavePayload();
    if (payload == null) {
      return;
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      void actions
        .saveTaskEdit(payload, {
          closeOnSuccess: false,
          toastOnSuccess: false
        })
        .then((saved) => {
          if (saved) {
            lastSyncedSignatureRef.current = JSON.stringify({
              title: payload.title,
              description: payload.description ?? "",
              projectId,
              dueDate,
              priority,
              status
            });
          }
        });
    }, 480);

    return () => {
      if (autosaveTimeoutRef.current != null) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [actions, description, draftSignature, dueDate, priority, projectId, status, task, title]);

  if (task == null) {
    return null;
  }

  const selectedProject = activeProjects.find((project) => project.id === projectId) ?? null;
  const dueDateLabel = dueDate
    ? new Date(`${dueDate}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "Без срока";

  function buildSavePayload(values: TaskEditFormValues = getValues()) {
    const normalizedTitle = values.title.trim();

    if (!normalizedTitle) {
      setError("title", {
        type: "required",
        message: "Добавьте короткое название задачи, чтобы сохранить изменения."
      });
      return null;
    }

    clearErrors("title");

    return {
      taskId,
      title: normalizedTitle,
      description: values.description.trim() ? values.description.trim() : null,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || null,
      projectId: values.projectId === INBOX_SELECT_VALUE ? null : values.projectId
    };
  }

  async function flushAutosave() {
    if (draftSignature === lastSyncedSignatureRef.current) {
      return true;
    }

    const payload = buildSavePayload();
    if (payload == null) {
      return false;
    }

    const saved = await actions.saveTaskEdit(payload, {
      closeOnSuccess: false,
      toastOnSuccess: false
    });

    if (saved) {
      lastSyncedSignatureRef.current = JSON.stringify({
        title: payload.title,
        description: payload.description ?? "",
        projectId,
        dueDate,
        priority,
        status
      });
    }

    return saved;
  }

  async function handleClose() {
    if (autosaveTimeoutRef.current != null) {
      window.clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }

    await flushAutosave();
    actions.closeTaskEdit();
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
                    <div className={styles.choiceList}>
                      {PRIORITY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          className={
                            priority === option.value
                              ? `${styles.choiceButton} ${styles.choiceButtonActive}`
                              : styles.choiceButton
                          }
                          onClick={() => {
                            setValue("priority", option.value, { shouldDirty: true });
                          }}
                          type="button"
                        >
                          <span className={styles.choiceButtonTitle}>{option.label}</span>
                          <span className={styles.choiceButtonDescription}>{option.helper}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.choiceGroup}>
                    <MetaText className={styles.choiceLabel}>Статус</MetaText>
                    <div className={styles.choiceList}>
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          className={
                            status === option.value
                              ? `${styles.choiceButton} ${styles.choiceButtonActive}`
                              : styles.choiceButton
                          }
                          onClick={() => {
                            setValue("status", option.value, { shouldDirty: true });
                          }}
                          type="button"
                        >
                          <span className={styles.choiceButtonTitle}>{option.label}</span>
                          <span className={styles.choiceButtonDescription}>{option.helper}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </EditorSection>
            </div>

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
                    confirmDisabled={state.isSaving}
                    confirmIcon="archive"
                    description="Задача исчезнет из активных экранов, но сохранится в архиве локально."
                    onConfirm={() => {
                      void actions.archiveTask(taskId);
                    }}
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
                    confirmDisabled={state.isSaving}
                    confirmIcon="trash"
                    confirmTone="alert"
                    description="Удаление уберёт задачу из локального плана без возможности восстановить её из активного интерфейса."
                    onConfirm={() => {
                      void actions.deleteTask(taskId);
                    }}
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
          </div>
        </div>
      </div>
    </Modal>
  );
}
