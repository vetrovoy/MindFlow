import { forwardRef } from "react";

import type { ButtonVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import { Icon, type IconName } from "@/shared/ui/icons";
import styles from "./primitives.module.css";
import { ActionButton } from "./action-button";

type IconTone = "default" | "muted" | "lime" | "alert" | "success" | "contrast";

export interface IconButtonProps {
  icon: IconName;
  ariaLabel: string;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  iconTone?: IconTone;
  onClick?: () => void;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { ariaLabel, className, disabled, icon, iconTone, onClick, type = "button", variant = "primary" },
  ref
) {
  return (
    <ActionButton
      className={cn(styles.iconButton, className)}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      type={type}
      variant={variant}
    >
      <span className={styles.srOnly}>{ariaLabel}</span>
      <Icon
        decorative
        name={icon}
        size={20}
        tone={iconTone ?? (variant === "primary" ? "contrast" : "default")}
      />
    </ActionButton>
  );
});
