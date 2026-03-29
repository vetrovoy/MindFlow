import { forwardRef, type ReactNode } from "react";

import type { ButtonVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

export interface ActionButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    { className, children, disabled, onClick, title, type = "button", variant = "primary" },
    ref
  ) {
    return (
      <button
        className={cn(
          styles.button,
          variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
          className
        )}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        title={title}
        type={type}
      >
        {children}
      </button>
    );
  }
);
