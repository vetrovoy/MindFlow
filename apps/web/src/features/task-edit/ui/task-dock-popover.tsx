import * as Popover from "@radix-ui/react-popover";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon, type IconName } from "@/shared/ui";
import styles from "../index.module.css";

interface TaskDockPopoverProps {
  iconName: IconName;
  triggerLabel: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function TaskDockPopover({
  active = false,
  children,
  className,
  iconName,
  triggerLabel
}: TaskDockPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span
          aria-label={triggerLabel}
          className={cn(styles.actionIcon, active && styles.actionIconActive, className)}
          role="button"
          tabIndex={0}
          title={triggerLabel}
        >
          <Icon decorative name={iconName} size={18} tone={active ? "lime" : "default"} />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className={styles.actionPopover}
          side="top"
          sideOffset={12}
        >
          {children}
          <Popover.Arrow className={styles.actionPopoverArrow} height={10} width={18} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
