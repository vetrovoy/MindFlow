import { PROJECT_DECORATIONS } from "@/shared/lib/projects";

import styles from "../index.module.css";

export function getProjectColorLabel(color: string) {
  return PROJECT_DECORATIONS.find((option) => option.color === color)?.label ?? "Маркер";
}

export function formatProjectDeadlineLabel(deadline: string) {
  return deadline
    ? new Date(`${deadline}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "Без дедлайна";
}

export function getProjectDeadlineChipToneClass(deadline: string) {
  return deadline ? styles.metaChipLime : styles.metaChipMuted;
}
