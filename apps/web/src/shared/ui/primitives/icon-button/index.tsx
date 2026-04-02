import { forwardRef } from "react";

import type { ButtonVariant } from "@mindflow/ui";
import type { IconTone } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import { Icon, type IconName } from "@/shared/ui/icons";
import styles from "./index.module.css";
import { ActionButton } from "../action-button";

export interface IconButtonProps {
  icon: IconName;
  ariaLabel: string;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  iconTone?: IconTone;
  onClick?: () => void;
  keyboardShortcut?: string;
  title?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { ariaLabel, className, disabled, icon, iconTone, keyboardShortcut, onClick, title, type = "button", variant = "primary" },
  ref
) {
  return (
    <ActionButton
      className={cn(styles.iconButton, className)}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      title={title}
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
      {keyboardShortcut ? (
        <span className={styles.keyboardShortcut} aria-hidden="true">
          {keyboardShortcut}
        </span>
      ) : null}
    </ActionButton>
  );
});
