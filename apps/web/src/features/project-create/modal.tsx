import { useState } from "react";

import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { cn } from "@/shared/lib/cn";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  ActionButton,
  ColorPickerField,
  DatePickerField,
  IconButton,
  MetaText,
  Modal,
  TextField
} from "@/shared/ui";
import styles from "./index.module.css";
import { ProjectCreateDockPopover } from "./ui/project-create-dock-popover";

interface ProjectCreateModalFeatureProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectCreateModalFeature({
  onClose,
  open
}: ProjectCreateModalFeatureProps) {
  const { actions } = useMindFlowApp();
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState<string>(PROJECT_DECORATIONS[0].color);
  const [nameError, setNameError] = useState<string | null>(null);

  const deadlineLabel = deadline
    ? new Date(`${deadline}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "";
  const colorLabel =
    PROJECT_DECORATIONS.find((option) => option.color === color)?.label ?? "Маркер";

  async function handleCreate() {
    const normalizedName = name.trim();

    if (!normalizedName) {
      setNameError("Добавьте название списка.");
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
            <MetaText>Создать список</MetaText>
          </div>
          <IconButton
            ariaLabel="Закрыть создание списка"
            icon="close"
            onClick={onClose}
            variant="secondary"
          />
        </div>

        <div className={styles.hero}>
          <TextField
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
            placeholder="Название списка"
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
            triggerLabel="Изменить маркер списка"
          >
            <div className={styles.popoverBody}>
              <ColorPickerField
                id="project-create-color"
                onChange={setColor}
                presets={PROJECT_DECORATIONS.map((option) => ({
                  value: option.color,
                  label: option.label
                }))}
                value={color}
              />
            </div>
          </ProjectCreateDockPopover>

          <ProjectCreateDockPopover
            active={Boolean(deadline)}
            iconName="today"
            triggerLabel="Изменить дедлайн"
          >
            <div className={styles.popoverBody}>
              <DatePickerField
                id="project-create-deadline"
                onChange={setDeadline}
                placeholder="Выберите дедлайн"
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
            Сохранить
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
