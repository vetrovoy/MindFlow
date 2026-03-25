import type { CSSProperties } from "react";

import { getProgressValue } from "@mindflow/ui";
import type { ProgressBarProps } from "@mindflow/ui";

import styles from "./primitives.module.css";

export function ProgressBar({ max, value }: ProgressBarProps) {
  const progress = getProgressValue({ max, value });

  return (
    <div aria-hidden="true" className={styles.progressBar}>
      <div
        className={styles.progressBarFill}
        style={{ "--progress": `${progress}` } as CSSProperties}
      />
    </div>
  );
}
