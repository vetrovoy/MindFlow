import { useCopy } from "@/app/providers/language-provider";
import { useEffect, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icons";
import styles from "./index.module.css";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
  contentClassName?: string;
  showHandle?: boolean;
}

export function Modal({
  children,
  className,
  contentClassName,
  onClose,
  open,
  showHandle = true
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className={cn(styles.overlay, className)} onClick={onClose}>
      <section
        aria-modal="true"
        className={cn(styles.content, contentClassName)}
        onClick={(event) => {
          event.stopPropagation();
        }}
        role="dialog"
      >
        {showHandle ? <div className={styles.handle} /> : null}
        {children}
      </section>
    </div>
  );
}

interface ModalHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}

export function ModalHeader({
  actions,
  description,
  eyebrow,
  onClose,
  title
}: ModalHeaderProps) {
  const copy = useCopy();

  return (
    <header className={styles.header}>
      <div className={styles.headerCopy}>
        {eyebrow == null ? null : <div className={styles.eyebrow}>{eyebrow}</div>}
        <div className={styles.title}>{title}</div>
        {description == null ? null : <div className={styles.description}>{description}</div>}
      </div>
      <div className={styles.headerActions}>
        {actions}
        <button
          aria-label={copy.common.close}
          className={styles.closeButton}
          onClick={onClose}
          type="button"
        >
          <Icon name="close" size={18} tone="muted" />
        </button>
      </div>
    </header>
  );
}
