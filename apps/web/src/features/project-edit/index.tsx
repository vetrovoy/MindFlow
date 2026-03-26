import * as Popover from "@radix-ui/react-popover";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { cn } from "@/shared/lib/cn";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  ColorPickerField,
  ConfirmDialog,
  DatePickerField,
  Icon,
  type IconName,
  IconButton,
  MetaText,
  Modal,
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

function getColorLabel(color: string) {
  return PROJECT_DECORATIONS.find((option) => option.color === color)?.label ?? "Маркер";
}

function formatDeadlineLabel(deadline: string) {
  return deadline
    ? new Date(`${deadline}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "Без дедлайна";
}

interface ProjectDockPopoverProps {
  iconName: IconName;
  triggerLabel: string;
  children: React.ReactNode;
  className?: string;
}

function ProjectDockPopover({
  children,
  className,
  iconName,
  triggerLabel
}: ProjectDockPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span
          aria-label={triggerLabel}
          className={cn(styles.actionIcon, className)}
          role="button"
          tabIndex={0}
          title={triggerLabel}
        >
          <Icon decorative name={iconName} size={18} tone="default" />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className={styles.actionPopover}
          side="top"
          sideOffset={12}
        >
          {children}
          <Popover.Arrow className={styles.actionPopoverArrow} height={10} width={18} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

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
  const deadlineLabel = formatDeadlineLabel(deadline);
  const colorLabel = getColorLabel(color);

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
            <MetaText>Редактировать список</MetaText>
            {isFavorite ? <StatusPill label="Избранное" variant="today" /> : null}
          </div>
          <IconButton
            ariaLabel="Закрыть редактирование списка"
            icon="close"
            onClick={() => {
              void handleClose();
            }}
            variant="secondary"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.hero}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  autoFocus
                  className={styles.titleField}
                  id="project-edit-name"
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    if (errors.name != null) {
                      clearErrors("name");
                    }
                  }}
                  placeholder="Название списка"
                  value={field.value}
                />
              )}
            />
            {errors.name?.message == null ? null : (
              <p className={styles.validationMessage}>{errors.name.message}</p>
            )}
            <div className={styles.metaInline}>
            <MetaText className={cn(styles.metaChip, styles.metaChipProgress)}>
              {projectSummary.progress.done}/{Math.max(projectSummary.progress.total, 1)} выполнено
            </MetaText>
            <MetaText className={cn(styles.metaChip, styles.metaChipRemaining)}>
              Осталось {remainingCount}
            </MetaText>
            <span className={cn(styles.metaChip, styles.metaChipColor)}>
              <span
                aria-hidden="true"
                className={styles.metaColorDot}
                style={{ backgroundColor: color }}
              />
              <MetaText>{colorLabel}</MetaText>
            </span>
            <MetaText className={cn(styles.metaChip, deadline ? styles.metaChipLime : styles.metaChipMuted)}>
              {deadlineLabel}
            </MetaText>
              {isFavorite ? (
                <MetaText className={cn(styles.metaChip, styles.metaChipFavorite)}>
                  Избранное
                </MetaText>
              ) : null}
            </div>
          </div>

          <div className={styles.toolbar}>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <ProjectDockPopover iconName="palette" triggerLabel="Изменить маркер списка">
                  <div className={styles.popoverBody}>
                    <MetaText className={styles.popoverLabel}>Маркер списка</MetaText>
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
                  </div>
                </ProjectDockPopover>
              )}
            />

            <Controller
              control={control}
              name="deadline"
              render={({ field }) => (
                <ProjectDockPopover iconName="today" triggerLabel="Изменить дедлайн">
                  <div className={styles.popoverBody}>
                    <MetaText className={styles.popoverLabel}>Дедлайн</MetaText>
                    <DatePickerField
                      ariaLabelledBy="project-edit-deadline-label"
                      id="project-edit-deadline"
                      onChange={field.onChange}
                      placeholder="Выберите дедлайн"
                      value={field.value}
                    />
                  </div>
                </ProjectDockPopover>
              )}
            />

            <span
              aria-label={isFavorite ? "Убрать список из избранного" : "Добавить список в избранное"}
              className={cn(styles.actionIcon, isFavorite && styles.actionIconActive)}
              onClick={() => {
                setValue("isFavorite", !isFavorite, { shouldDirty: true });
              }}
              role="button"
              tabIndex={0}
              title={isFavorite ? "Убрать список из избранного" : "Добавить список в избранное"}
            >
              <Icon decorative name="favorite" size={18} tone={isFavorite ? "lime" : "default"} />
            </span>

            <ProjectDockPopover iconName="more" triggerLabel="Дополнительные действия">
              <div className={styles.menuBody}>
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
                      className={styles.menuAction}
                      icon="archive"
                      variant="secondary"
                    />
                  }
                />
              </div>
            </ProjectDockPopover>
          </div>
        </div>
      </div>
    </Modal>
  );
}
