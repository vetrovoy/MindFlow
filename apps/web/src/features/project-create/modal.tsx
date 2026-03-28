import { useEffect, useState } from "react";

import { formatDisplayDate } from "@mindflow/copy";

import { useCopy, useLanguage } from "@/app/providers/language-provider";
import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { cn } from "@/shared/lib/cn";
import { useAppState } from "@/shared/model/app-store-provider";
import {
  ActionButton,
  ColorPickerField,
  DatePickerField,
  IconButton,
  MetaText,
  Modal,
  TextAreaField
} from "@/shared/ui";
import styles from "./index.module.css";
import { getProjectColorLabel } from "@/features/project-edit/model/project-edit.view";
import { ProjectCreateDockPopover } from "./ui/project-create-dock-popover";

interface ProjectCreateModalFeatureProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectCreateModalFeature({
  onClose,
  open
}: ProjectCreateModalFeatureProps) {
  const copy = useCopy();
  const { language } = useLanguage();
  const { actions } = useAppState();
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState<string>(PROJECT_DECORATIONS[0].color);
  const [nameError, setNameError] = useState<string | null>(null);

  const deadlineLabel = deadline ? formatDisplayDate(deadline, language) : "";
  const colorLabel = getProjectColorLabel(copy, color);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName("");
    setDeadline("");
    setColor(PROJECT_DECORATIONS[0].color);
    setNameError(null);
  }, [open]);

  async function handleCreate() {
    const normalizedName = name.trim();

    if (!normalizedName) {
      setNameError(copy.project.titleRequired);
      return;
    }

    const created = await actions.createProject({
      name: normalizedName,
      deadline: deadline || null,
      color
    });

    if (!created) {
      return;
    }

    setName("");
    setDeadline("");
    setColor(PROJECT_DECORATIONS[0].color);
    setNameError(null);
    onClose();
  }

  return (
    <Modal
      contentClassName={styles.modalContent}
      onClose={onClose}
      open={open}
      showHandle={false}
    >
      <div className={styles.root}>
        <div className={styles.headerBar}>
          <div className={styles.headerMeta}>
            <MetaText>{copy.project.createTitle}</MetaText>
          </div>
          <IconButton
            ariaLabel={copy.project.createCloseAriaLabel}
            icon="close"
            onClick={onClose}
            variant="secondary"
          />
        </div>

        <div className={styles.hero}>
          <TextAreaField
            autoFocus
            className={styles.titleField}
            id="project-create-name"
            onChange={(event) => {
              setName(event.target.value);
              if (nameError != null) {
                setNameError(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleCreate();
              }
            }}
            placeholder={copy.project.titlePlaceholder}
            rows={2}
            value={name}
          />
          {nameError == null ? null : (
            <p className={styles.validationMessage}>{nameError}</p>
          )}
          {deadlineLabel ? (
            <div className={styles.metaInline}>
              <MetaText className={styles.metaChip}>{deadlineLabel}</MetaText>
              <span className={cn(styles.metaChip, styles.metaChipColor)}>
                <span
                  aria-hidden="true"
                  className={styles.metaColorDot}
                  style={{ backgroundColor: color }}
                />
                <MetaText>{colorLabel}</MetaText>
              </span>
            </div>
          ) : colorLabel ? (
            <div className={styles.metaInline}>
              <span className={cn(styles.metaChip, styles.metaChipColor)}>
                <span
                  aria-hidden="true"
                  className={styles.metaColorDot}
                  style={{ backgroundColor: color }}
                />
                <MetaText>{colorLabel}</MetaText>
              </span>
            </div>
          ) : null}
        </div>

        <div className={styles.toolbar}>
          <ProjectCreateDockPopover
            active={color !== PROJECT_DECORATIONS[0].color}
            iconName="palette"
            triggerLabel={copy.project.changeMarkerTrigger}
          >
            <div className={styles.popoverBody}>
              <ColorPickerField
                id="project-create-color"
                onChange={setColor}
                presets={PROJECT_DECORATIONS.map((option) => ({
                  value: option.color,
                  label: copy.project.colors[option.id]
                }))}
                value={color}
              />
            </div>
          </ProjectCreateDockPopover>

          <ProjectCreateDockPopover
            active={Boolean(deadline)}
            iconName="today"
            triggerLabel={copy.project.changeDeadlineTrigger}
          >
            <div className={styles.popoverBody}>
              <DatePickerField
                id="project-create-deadline"
                onChange={setDeadline}
                placeholder={copy.editor.selectDeadlinePlaceholder}
                value={deadline}
              />
            </div>
          </ProjectCreateDockPopover>

          <ActionButton
            className={styles.saveButton}
            onClick={() => {
              void handleCreate();
            }}
          >
            {copy.common.save}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
