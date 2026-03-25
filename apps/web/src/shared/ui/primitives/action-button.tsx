import type { ReactNode } from "react";

import type { ButtonVariant } from "@mindflow/ui";

import { cn } from "@/shared/lib/cn";
import styles from "./primitives.module.css";

export interface ActionButtonProps {
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
