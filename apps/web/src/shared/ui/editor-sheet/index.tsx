import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Body, Heading, MetaText } from "@/shared/ui/typography";
import styles from "./index.module.css";

interface EditorSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

interface EditorFooterProps {
  children: ReactNode;
  className?: string;
}

interface ConfirmActionRowProps {
  title: string;
  description: string;
  children: ReactNode;
  tone?: "default" | "alert";
}

export function EditorSection({
  children,
  className,
  description,
  title
}: EditorSectionProps) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.sectionHeader}>
        <Heading as="h3" className={styles.sectionTitle}>
          {title}
        </Heading>
        {description == null ? null : (
          <Body className={styles.sectionDescription}>{description}</Body>
        )}
      </div>
      {children}
    </section>
  );
}

export function EditorFooter({ children, className }: EditorFooterProps) {
  return <footer className={cn(styles.footer, className)}>{children}</footer>;
}

export function ConfirmActionRow({
  children,
  description,
  title,
  tone = "default"
}: ConfirmActionRowProps) {
  return (
    <div
      className={cn(
        styles.confirmRow,
        tone === "alert" && styles.confirmRowAlert
      )}
    >
      <div className={styles.confirmCopy}>
        <MetaText
          as="strong"
          className={cn(
            styles.confirmTitle,
            tone === "alert" && styles.confirmTitleAlert
          )}
        >
          {title}
        </MetaText>
        <Body className={styles.confirmDescription}>{description}</Body>
      </div>
      <div className={styles.confirmActions}>{children}</div>
    </div>
  );
}
