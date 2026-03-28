import { useCopy } from "@/app/providers/language-provider";
import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { cn } from "@/shared/lib/cn";
import {
  ColorPickerField,
  ConfirmDialog,
  DatePickerField,
  DockIconButton,
  IconButton,
  MetaText,
  TextField
} from "@/shared/ui";
import { getProjectColorLabel } from "../model/project-edit.view";
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
  const copy = useCopy();
  const colorLabel = getProjectColorLabel(copy, color);

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
          placeholder={copy.project.titlePlaceholder}
          value={name}
        />
        {nameError == null ? null : (
          <p className={styles.validationMessage}>{nameError}</p>
        )}
        <div className={styles.metaInline}>
          <MetaText className={cn(styles.metaChip, styles.metaChipProgress)}>
            {copy.project.progressLabel(progressDone, progressTotal)}
          </MetaText>
          <MetaText className={cn(styles.metaChip, styles.metaChipRemaining)}>
            {copy.project.inProgressLabel(remainingCount)}
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
              deadlineLabel === copy.project.noDeadline
                ? styles.metaChipMuted
                : styles.metaChipLime
            )}
          >
            {deadlineLabel}
          </MetaText>
          {isFavorite ? (
            <MetaText className={cn(styles.metaChip, styles.metaChipFavorite)}>
              {copy.lists.favoritesTitle}
            </MetaText>
          ) : null}
        </div>
      </div>

      <div className={styles.toolbar}>
        <ProjectDockPopover
          active={color !== PROJECT_DECORATIONS[0].color}
          iconName="palette"
          triggerLabel={copy.project.changeMarkerTrigger}
        >
          <div className={styles.popoverBody}>
            <ColorPickerField
              ariaLabelledBy="project-edit-color-label"
              id="project-edit-color"
              onChange={onColorChange}
              presets={PROJECT_DECORATIONS.map((option) => ({
                value: option.color,
                label: copy.project.colors[option.id]
              }))}
              value={color}
            />
          </div>
        </ProjectDockPopover>

        <ProjectDockPopover
          active={Boolean(deadline)}
          iconName="today"
          triggerLabel={copy.project.changeDeadlineTrigger}
        >
          <div className={styles.popoverBody}>
            <DatePickerField
              ariaLabelledBy="project-edit-deadline-label"
              id="project-edit-deadline"
              onChange={onDeadlineChange}
              placeholder={copy.editor.selectDeadlinePlaceholder}
              value={deadline}
            />
          </div>
        </ProjectDockPopover>

        <DockIconButton
          active={isFavorite}
          aria-label={
            isFavorite
              ? copy.project.removeFavoriteAriaLabel
              : copy.project.addFavoriteAriaLabel
          }
          aria-pressed={isFavorite}
          className={styles.favoriteButton}
          iconName="favorite"
          onClick={() => {
            onFavoriteChange(!isFavorite);
          }}
          title={
            isFavorite
              ? copy.project.removeFavoriteAriaLabel
              : copy.project.addFavoriteAriaLabel
          }
        />

        <ProjectDockPopover iconName="more" triggerLabel={copy.project.moreActionsTrigger}>
          <div className={styles.menuBody}>
            <ConfirmDialog
              confirmAriaLabel={copy.editor.confirmAriaLabel}
              confirmDisabled={state.isSaving}
              confirmIcon="archive"
              description={copy.project.archiveConfirmDescription}
              onConfirm={() => {
                void actions.archiveProject(projectId);
              }}
              title={copy.project.archiveConfirmTitle}
              trigger={
                <IconButton
                  ariaLabel={copy.project.archiveAriaLabel}
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
