import type { ReactNode } from "react";

import { Body, Heading } from "@/shared/ui/typography";
import styles from "./index.module.css";

export interface SectionTitleProps {
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
        {subtitle == null ? null : (
          <Body className={styles.sectionSubtitle}>{subtitle}</Body>
        )}
      </div>
      {action}
    </header>
  );
}
