import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import { useEffect, useMemo, useRef, useState } from "react";

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

export function TaskEditFeature() {
  const { actions, derived, state } = useMindFlowApp();
  const task = derived.editingTask;
  const activeProjects = [...derived.favoriteProjects, ...derived.regularProjects];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
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
      setValidationMessage(null);
      return;
    }

    if (hydratedTaskIdRef.current === task.id) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? "");
    setProjectId(task.projectId ?? INBOX_SELECT_VALUE);
    setDueDate(task.dueDate ?? "");
    setPriority(task.priority);
    setStatus(task.status);
    setValidationMessage(null);
    hydratedTaskIdRef.current = task.id;
    lastSyncedSignatureRef.current = JSON.stringify({
      title: task.title,
      description: task.description ?? "",
      projectId: task.projectId ?? INBOX_SELECT_VALUE,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
      status: task.status
    });
  }, [task]);
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
      void actions.saveTaskEdit(payload, {
        closeOnSuccess: false,
        toastOnSuccess: false
      }).then((saved) => {
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
  }, [actions, description, draftSignature, dueDate, priority, projectId, status, task, taskId, title]);

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

  function buildSavePayload() {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setValidationMessage("Добавьте короткое название задачи, чтобы сохранить изменения.");
      return null;
    }

    setValidationMessage(null);

    return {
      taskId,
      title: normalizedTitle,
      description: description.trim() ? description.trim() : null,
      status,
      priority,
      dueDate: dueDate || null,
      projectId: projectId === INBOX_SELECT_VALUE ? null : projectId
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
                  <TextField
                    autoFocus
                    id="task-edit-title"
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (validationMessage != null) {
                        setValidationMessage(null);
                      }
                    }}
                    placeholder="Что именно нужно сделать?"
                    value={title}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="task-edit-description">
                    Описание
                  </label>
                  <TextAreaField
                    id="task-edit-description"
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                    placeholder="Добавьте детали, ссылки или короткий next step..."
                    value={description}
                  />
                </div>
                {validationMessage == null || title.trim() ? null : (
                  <p className={styles.validationMessage}>{validationMessage}</p>
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
                    <SelectField
                      ariaLabelledBy="task-edit-project-label"
                      id="task-edit-project"
                      onValueChange={(value) => {
                        setProjectId(value);
                      }}
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
                  <div className={styles.fieldGroup}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor="task-edit-due-date"
                      id="task-edit-due-date-label"
                    >
                      Дата
                    </label>
                    <DatePickerField
                      ariaLabelledBy="task-edit-due-date-label"
                      id="task-edit-due-date"
                      onChange={setDueDate}
                      placeholder="Выберите срок"
                      value={dueDate}
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
                            setPriority(option.value);
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
                            setStatus(option.value);
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
              <section className={styles.overviewCard}>
                <MetaText className={styles.overviewLabel}>Обзор</MetaText>
                <Heading as="strong" className={styles.overviewTitle}>
                  {title.trim() || "Новая формулировка задачи"}
                </Heading>
                <div className={styles.overviewMeta}>
                  <div className={styles.overviewMetaRow}>
                    <MetaText className={styles.overviewMetaLabel}>Список</MetaText>
                    {selectedProject == null ? (
                      <MetaText className={styles.overviewMetaValue}>Входящие</MetaText>
                    ) : (
                      <ProjectBadge color={selectedProject.color} label={selectedProject.name} />
                    )}
                  </div>
                  <div className={styles.overviewMetaRow}>
                    <MetaText className={styles.overviewMetaLabel}>Срок</MetaText>
                    <MetaText className={styles.overviewMetaValue}>{dueDateLabel}</MetaText>
                  </div>
                </div>
              </section>

              <EditorSection title="Действия">
                <div className={styles.secondaryActions}>
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
                        className={styles.secondaryActionButton}
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
                        className={styles.secondaryActionButton}
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
