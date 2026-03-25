import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  ColorPickerField,
  ConfirmDialog,
  DatePickerField,
  EditorSection,
  Heading,
  IconButton,
  MetaText,
  Modal,
  ModalHeader,
  ProgressBar,
  ProjectBadge,
  StatusPill,
  TextField
} from "@/shared/ui";
import styles from "./index.module.css";

interface ProjectEditFormValues {
  name: string;
  color: string;
  deadline: string;
  isFavorite: boolean;
}

const DEFAULT_VALUES: ProjectEditFormValues = {
  name: "",
  color: PROJECT_DECORATIONS[0].color,
  deadline: "",
  isFavorite: false
};

export function ProjectEditFeature() {
  const { actions, derived, state } = useMindFlowApp();
  const project = derived.editingProject;
  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    reset,
    setError,
    setValue
  } = useForm<ProjectEditFormValues>({
    defaultValues: DEFAULT_VALUES
  });
  const name = useWatch({ control, name: "name" }) ?? "";
  const color = useWatch({ control, name: "color" }) ?? PROJECT_DECORATIONS[0].color;
  const deadline = useWatch({ control, name: "deadline" }) ?? "";
  const isFavorite = useWatch({ control, name: "isFavorite" }) ?? false;
  const lastSyncedSignatureRef = useRef<string>("");
  const hydratedProjectIdRef = useRef<string | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const projectId = project?.id ?? "";

  const projectSummary = useMemo(() => {
    if (project == null) {
      return null;
    }

    return (
      derived.projectSections.find((section) => section.project.id === project.id) ?? {
        project,
        tasks: state.tasks.filter(
          (task) => task.projectId === project.id && task.archivedAt == null
        ),
        progress: {
          done: state.tasks.filter(
            (task) =>
              task.projectId === project.id &&
              task.archivedAt == null &&
              task.status === "done"
          ).length,
          total: state.tasks.filter(
            (task) => task.projectId === project.id && task.archivedAt == null
          ).length,
          ratio: 0
        }
      }
    );
  }, [derived.projectSections, project, state.tasks]);

  useEffect(() => {
    if (project == null) {
      hydratedProjectIdRef.current = null;
      if (autosaveTimeoutRef.current != null) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
      clearErrors();
      reset(DEFAULT_VALUES);
      return;
    }

    if (hydratedProjectIdRef.current === project.id) {
      return;
    }

    const nextValues: ProjectEditFormValues = {
      name: project.name,
      color: project.color,
      deadline: project.deadline ?? "",
      isFavorite: project.isFavorite
    };

    reset(nextValues);
    clearErrors();
    hydratedProjectIdRef.current = project.id;
    lastSyncedSignatureRef.current = JSON.stringify(nextValues);
  }, [clearErrors, project, reset]);

  const draftSignature = useMemo(
    () =>
      JSON.stringify({
        name,
        color,
        deadline,
        isFavorite
      }),
    [color, deadline, isFavorite, name]
  );

  useEffect(() => {
    if (project == null) {
      return;
    }

    if (hydratedProjectIdRef.current !== project.id) {
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
        .saveProjectEdit(payload, {
          closeOnSuccess: false,
          toastOnSuccess: false
        })
        .then((saved) => {
          if (saved) {
            lastSyncedSignatureRef.current = JSON.stringify({
              name: payload.name,
              color,
              deadline,
              isFavorite
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
  }, [actions, color, deadline, draftSignature, isFavorite, name, project]);

  if (project == null || projectSummary == null) {
    return null;
  }

  const remainingCount = Math.max(
    projectSummary.progress.total - projectSummary.progress.done,
    0
  );

  function buildSavePayload(values: ProjectEditFormValues = getValues()) {
    const normalizedName = values.name.trim();

    if (!normalizedName) {
      setError("name", {
        type: "required",
        message: "У списка должно быть название, чтобы его можно было сохранить."
      });
      return null;
    }

    clearErrors("name");

    return {
      projectId,
      name: normalizedName,
      color: values.color,
      isFavorite: values.isFavorite,
      deadline: values.deadline || null
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

    const saved = await actions.saveProjectEdit(payload, {
      closeOnSuccess: false,
      toastOnSuccess: false
    });

    if (saved) {
      lastSyncedSignatureRef.current = JSON.stringify({
        name: payload.name,
        color,
        deadline,
        isFavorite
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
    actions.closeProjectEdit();
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
          eyebrow={<MetaText>Список проекта</MetaText>}
          onClose={() => {
            void handleClose();
          }}
          title={
            <Heading as="strong" className={styles.headerTitle}>
              Редактирование списка
            </Heading>
          }
        />

        <div className={styles.content}>
          <section className={styles.heroCard}>
            <div className={styles.heroHeader}>
              <div className={styles.heroIdentity}>
                <ProjectBadge color={color} label={name.trim() || "Новый список"} />
                {isFavorite ? <StatusPill label="Избранное" variant="today" /> : null}
              </div>
              <IconButton
                ariaLabel={
                  isFavorite
                    ? "Убрать список из избранного"
                    : "Добавить список в избранное"
                }
                className={
                  isFavorite
                    ? `${styles.favoriteButton} ${styles.favoriteButtonActive}`
                    : styles.favoriteButton
                }
                icon="favorite"
                onClick={() => {
                  setValue("isFavorite", !isFavorite, { shouldDirty: true });
                }}
                variant="secondary"
              />
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStatsBox}>
                <MetaText className={styles.summaryLabel}>Прогресс</MetaText>
                <Heading as="strong" className={styles.summaryValue}>
                  {projectSummary.progress.done}/{Math.max(projectSummary.progress.total, 1)}
                </Heading>
              </div>
              <div className={styles.heroStatsBox}>
                <MetaText className={styles.summaryLabel}>Осталось</MetaText>
                <Heading as="strong" className={styles.summaryValue}>
                  {remainingCount}
                </Heading>
              </div>
              <div className={styles.heroStatsBox}>
                <MetaText className={styles.summaryLabel}>Дедлайн</MetaText>
                <Heading as="strong" className={styles.summaryValue}>
                  {deadline
                    ? new Date(`${deadline}T00:00:00`).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long"
                      })
                    : "Не задан"}
                </Heading>
              </div>
            </div>
            <ProgressBar
              max={Math.max(projectSummary.progress.total, 1)}
              value={projectSummary.progress.done}
            />
          </section>

          <div className={styles.editorGrid}>
            <div className={styles.mainColumn}>
              <EditorSection title="Идентичность">
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="project-edit-name">
                    Название
                  </label>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <TextField
                        autoFocus
                        id="project-edit-name"
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          if (errors.name != null) {
                            clearErrors("name");
                          }
                        }}
                        placeholder="Например, Landing MVP"
                        value={field.value}
                      />
                    )}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor="project-edit-color"
                    id="project-edit-color-label"
                  >
                    Маркер списка
                  </label>
                  <Controller
                    control={control}
                    name="color"
                    render={({ field }) => (
                      <ColorPickerField
                        ariaLabelledBy="project-edit-color-label"
                        id="project-edit-color"
                        onChange={field.onChange}
                        presets={PROJECT_DECORATIONS.map((option) => ({
                          value: option.color,
                          label: option.label
                        }))}
                        value={field.value}
                      />
                    )}
                  />
                </div>
                {errors.name?.message == null ? null : (
                  <p className={styles.validationMessage}>{errors.name.message}</p>
                )}
              </EditorSection>

              <EditorSection title="Дедлайн">
                <div className={styles.contextRow}>
                  <div className={styles.fieldGroup}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor="project-edit-deadline"
                      id="project-edit-deadline-label"
                    >
                      Дедлайн
                    </label>
                    <Controller
                      control={control}
                      name="deadline"
                      render={({ field }) => (
                        <DatePickerField
                          ariaLabelledBy="project-edit-deadline-label"
                          id="project-edit-deadline"
                          onChange={field.onChange}
                          placeholder="Выберите дедлайн"
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                </div>
              </EditorSection>
            </div>

            <aside className={styles.sideColumn}>
              <EditorSection title="Действия">
                <ConfirmDialog
                  confirmAriaLabel="Подтвердить архивацию списка"
                  confirmDisabled={state.isSaving}
                  confirmIcon="archive"
                  description="Список уйдёт из активных экранов, а задачи внутри станут видны только после восстановления из архива."
                  onConfirm={() => {
                    void actions.archiveProject(projectId);
                  }}
                  title="Подтвердите архивацию"
                  trigger={
                    <IconButton
                      ariaLabel="Архивировать список"
                      className={styles.archiveButton}
                      icon="archive"
                      variant="secondary"
                    />
                  }
                />
              </EditorSection>
            </aside>
          </div>
        </div>
      </div>
    </Modal>
  );
}
