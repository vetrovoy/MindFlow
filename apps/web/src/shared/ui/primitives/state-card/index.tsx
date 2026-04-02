import { getFeedbackCardRole } from "@mindflow/ui";
import type { FeedbackCardVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icons";
import { Body, Title } from "@/shared/ui/typography";
import styles from "./index.module.css";

export interface StateCardProps {
  variant: FeedbackCardVariant;
  title: string;
  description?: string;
}

export function StateCard({ description, title, variant }: StateCardProps) {
  const iconName =
    variant === "error" ? "close" : variant === "loading" ? "search" : "checkbox-empty";

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
      <div
        className={cn(
          styles.stateAccent,
          variant === "error"
            ? styles.stateAccentError
            : variant === "loading"
              ? styles.stateAccentLoading
              : styles.stateAccentEmpty
        )}
      >
        <Icon
          decorative
          name={iconName}
          size={16}
          tone={variant === "error" ? "alert" : variant === "loading" ? "accent" : "muted"}
        />
      </div>
      <div className={styles.stateContent}>
        <Title
          as="strong"
          className={cn(
            styles.stateTitle,
            variant === "error" ? styles.stateTitleError : styles.stateTitleDefault
          )}
        >
          {title}
        </Title>
        {description == null ? null : (
          <Body className={styles.stateDescription}>{description}</Body>
        )}
      </div>
    </div>
  );
}
