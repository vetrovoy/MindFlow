import type { ReactNode } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import { cn } from "@/shared/lib/cn";
import { Icon, MetaText } from "@/shared/ui";
import styles from "./index.module.css";

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function CollapsibleSection({
  children,
  className,
  contentClassName,
  count,
  defaultOpen = true,
  title
}: CollapsibleSectionProps) {
  return (
    <Collapsible.Root
      className={cn(styles.root, className)}
      defaultOpen={defaultOpen}
    >
      <Collapsible.Trigger className={styles.trigger}>
        <div className={styles.heading}>
          <strong className={styles.title}>{title}</strong>
          {count == null ? null : (
            <MetaText className={styles.count}>{count}</MetaText>
          )}
        </div>
        <span className={styles.chevron}>
          <Icon decorative name="chevron-right" size={16} tone="muted" />
        </span>
      </Collapsible.Trigger>
      <div aria-hidden="true" className={styles.divider} />
      <Collapsible.Content className={cn(styles.content, contentClassName)}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
