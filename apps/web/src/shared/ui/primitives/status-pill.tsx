import type { StatusBadgeVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import styles from "./primitives.module.css";

export interface StatusPillProps {
  label: string;
  variant: StatusBadgeVariant;
}

export function StatusPill({ label, variant }: StatusPillProps) {
  return (
    <span
      className={cn(
        styles.statusPill,
        variant === "today" ? styles.statusPillToday : styles.statusPillOverdue
      )}
    >
      {label}
    </span>
  );
}
