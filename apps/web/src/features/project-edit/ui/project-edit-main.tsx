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
  color: string;
  deadline: string;
  deadlineLabel: string;
  isFavorite: boolean;
  name: string;
  nameError: string | null;
  onColorChange: (color: string) => void;
  onDeadlineChange: (deadline: string) => void;
  onFavoriteChange: (next: boolean) => void;
  onNameChange: (name: string) => void;
  projectId: string;
  progressDone: number;
  progressTotal: number;
  remainingCount: number;
  state: { isSaving: boolean };
}

export function ProjectEditMain({
  actions,
  color,
  deadline,
  deadlineLabel,
  isFavorite,
  name,
  nameError,
  onColorChange,
  onDeadlineChange,
  onFavoriteChange,
  onNameChange,
  progressDone,
  progressTotal,
  projectId,
  remainingCount,
  state
}: ProjectEditMainProps) {
  const colorLabel =
    PROJECT_DECORATIONS.find((option) => option.color === color)?.label ?? "Маркер";

  return (
    <div className={styles.content}>
      <div className={styles.hero}>
        <TextField
          autoFocus
          className={styles.titleField}
          id="project-edit-name"
          onChange={(event) => {
            onNameChange(event.target.value);
          }}
          placeholder="Название списка"
          value={name}
        />
        {nameError == null ? null : (
          <p className={styles.validationMessage}>{nameError}</p>
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
        <ProjectDockPopover iconName="palette" triggerLabel="Изменить маркер списка">
          <div className={styles.popoverBody}>
            <MetaText className={styles.popoverLabel}>Маркер списка</MetaText>
            <ColorPickerField
              ariaLabelledBy="project-edit-color-label"
              id="project-edit-color"
              onChange={onColorChange}
              presets={PROJECT_DECORATIONS.map((option) => ({
                value: option.color,
                label: option.label
              }))}
              value={color}
            />
          </div>
        </ProjectDockPopover>

        <ProjectDockPopover iconName="today" triggerLabel="Изменить дедлайн">
          <div className={styles.popoverBody}>
            <MetaText className={styles.popoverLabel}>Дедлайн</MetaText>
            <DatePickerField
              ariaLabelledBy="project-edit-deadline-label"
              id="project-edit-deadline"
              onChange={onDeadlineChange}
              placeholder="Выберите дедлайн"
              value={deadline}
            />
          </div>
        </ProjectDockPopover>

        <span
          aria-label={isFavorite ? "Убрать список из избранного" : "Добавить список в избранное"}
          className={cn(styles.actionIcon, isFavorite && styles.actionIconActive)}
          onClick={() => {
            onFavoriteChange(!isFavorite);
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
