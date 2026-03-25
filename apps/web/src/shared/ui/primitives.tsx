import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

import { getFeedbackCardRole, getProgressValue } from "@mindflow/ui";
import type {
  ButtonVariant,
  FeedbackCardVariant,
  ProgressBarProps,
  StatusBadgeVariant
} from "@mindflow/ui";
import { cn } from "../lib/cn";
import { Icon, type IconName } from "./icons";
import { Body, Heading, Title } from "./typography";
import styles from "./primitives.module.css";

interface ActionButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ActionButton({
  className,
  children,
  disabled,
  onClick,
  type = "button",
  variant = "primary"
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

interface IconButtonProps {
  icon: IconName;
  ariaLabel: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function IconButton({
  ariaLabel,
  className,
  disabled,
  icon,
  onClick,
  variant = "primary"
}: IconButtonProps) {
  return (
    <ActionButton
      className={cn(styles.iconButton, className)}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
    >
      <span className={styles.srOnly}>{ariaLabel}</span>
      <Icon decorative name={icon} size={20} tone={variant === "primary" ? "contrast" : "default"} />
    </ActionButton>
  );
}

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return <input {...rest} className={cn(styles.field, className)} />;
}

export function SelectField(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;

  return <select {...rest} className={cn(styles.field, className)} />;
}

export function TextAreaField(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  return <textarea {...rest} className={cn(styles.field, styles.textareaField, className)} />;
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionTitle({ action, subtitle, title }: SectionTitleProps) {
  return (
    <header className={styles.sectionTitle}>
      <div>
        <Heading as="h2" className={styles.sectionHeading}>
          {title}
        </Heading>
        {subtitle == null ? null : <Body className={styles.sectionSubtitle}>{subtitle}</Body>}
      </div>
      {action}
    </header>
  );
}

interface SurfaceCardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function SurfaceCard({ children, style }: SurfaceCardProps) {
  return (
    <section className={styles.surfaceCard} style={style}>
      {children}
    </section>
  );
}

interface StateCardProps {
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

interface StatusPillProps {
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
