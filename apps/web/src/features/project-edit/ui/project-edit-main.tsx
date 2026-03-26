import { Controller } from "react-hook-form";

import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { cn } from "@/shared/lib/cn";
import {
  ColorPickerField,
  ConfirmDialog,
  DatePickerField,
  Icon,
  IconButton,
  MetaText,
  TextField
} from "@/shared/ui";
import { ProjectDockPopover } from "./project-dock-popover";
import styles from "../index.module.css";

interface ProjectEditMainProps {
  actions: {
    archiveProject: (projectId: string) => Promise<void>;
  };
  clearErrors: (name?: "name") => void;
  color: string;
  control: any;
  deadlineLabel: string;
  errors: { name?: { message?: string } };
  isFavorite: boolean;
  projectId: string;
  progressDone: number;
  progressTotal: number;
  remainingCount: number;
  setFavorite: (next: boolean) => void;
  state: { isSaving: boolean };
}

export function ProjectEditMain({
  actions,
  clearErrors,
  color,
  control,
  deadlineLabel,
  errors,
  isFavorite,
  progressDone,
  progressTotal,
  projectId,
  remainingCount,
  setFavorite,
  state
}: ProjectEditMainProps) {
  const colorLabel =
    PROJECT_DECORATIONS.find((option) => option.color === color)?.label ?? "Маркер";

  return (
    <div className={styles.content}>
      <div className={styles.hero}>
        <Controller
          control={control}
          name="name"
          render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
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
            {progressDone}/{Math.max(progressTotal, 1)} выполнено
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
          <MetaText
            className={cn(
              styles.metaChip,
              deadlineLabel === "Без дедлайна" ? styles.metaChipMuted : styles.metaChipLime
            )}
          >
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
          render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
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
          render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
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
            setFavorite(!isFavorite);
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
  );
}
