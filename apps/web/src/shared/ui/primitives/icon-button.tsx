import type { ButtonVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import { Icon, type IconName } from "@/shared/ui/icons";
import styles from "./primitives.module.css";
import { ActionButton } from "./action-button";

export interface IconButtonProps {
  icon: IconName;
  ariaLabel: string;
  variant?: ButtonVariant;
  type?: "button" | "submit";
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
  type = "button",
  variant = "primary"
}: IconButtonProps) {
  return (
    <ActionButton
      className={cn(styles.iconButton, className)}
      disabled={disabled}
      onClick={onClick}
      type={type}
      variant={variant}
    >
      <span className={styles.srOnly}>{ariaLabel}</span>
      <Icon decorative name={icon} size={20} tone={variant === "primary" ? "contrast" : "default"} />
    </ActionButton>
  );
}
