import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { IconButton } from "@/shared/ui/primitives";
import { Body, Heading } from "@/shared/ui/typography";
import styles from "./index.module.css";

interface ConfirmDialogProps {
  title: string;
  description: string;
  trigger: ReactNode;
  confirmAriaLabel: string;
  confirmIcon: "archive" | "trash" | "check";
  confirmTone?: "default" | "alert";
  confirmDisabled?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  confirmAriaLabel,
  confirmDisabled = false,
  confirmIcon,
  confirmTone = "default",
  description,
  onConfirm,
  title,
  trigger
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.overlay} />
        <AlertDialog.Content className={styles.content}>
          <div className={styles.card}>
            <div className={styles.copy}>
              <AlertDialog.Title asChild>
                <Heading as="strong" className={styles.title}>
                  {title}
                </Heading>
              </AlertDialog.Title>
              <AlertDialog.Description asChild>
                <Body className={styles.description}>{description}</Body>
              </AlertDialog.Description>
            </div>
            <div className={styles.actions}>
              <AlertDialog.Cancel asChild>
                <IconButton
                  ariaLabel="Отменить подтверждение"
                  icon="close"
                  variant="secondary"
                />
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <IconButton
                  ariaLabel={confirmAriaLabel}
                  className={cn(confirmTone === "alert" && styles.confirmAlert)}
                  disabled={confirmDisabled}
                  icon={confirmIcon}
                  onClick={onConfirm}
                />
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
