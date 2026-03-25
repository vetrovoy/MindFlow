import { getFeedbackCardRole } from "@mindflow/ui";
import type { FeedbackCardVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import { Body, Title } from "@/shared/ui/typography";
import styles from "./primitives.module.css";

export interface StateCardProps {
  variant: FeedbackCardVariant;
  title: string;
  description?: string;
}

export function StateCard({ description, title, variant }: StateCardProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        styles.stateCard,
        variant === "error"
          ? styles.stateCardError
          : variant === "loading"
            ? styles.stateCardLoading
            : styles.stateCardEmpty
      )}
      role={getFeedbackCardRole({ variant, title, description })}
    >
      <Title
        as="strong"
        className={cn(
          styles.stateTitle,
          variant === "error" ? styles.stateTitleError : styles.stateTitleDefault
        )}
      >
        {title}
      </Title>
      {description == null ? null : <Body className={styles.stateDescription}>{description}</Body>}
    </div>
  );
}
