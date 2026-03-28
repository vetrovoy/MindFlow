import * as Popover from "@radix-ui/react-popover";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui";
import styles from "./project-create-dock-popover.module.css";

interface ProjectCreateDockPopoverProps {
  iconName: "palette" | "today";
  triggerLabel: string;
  children: ReactNode;
  active?: boolean;
}

export function ProjectCreateDockPopover({
  active = false,
  children,
  iconName,
  triggerLabel
}: ProjectCreateDockPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-label={triggerLabel}
          className={cn(styles.actionIcon, active && styles.actionIconActive)}
          title={triggerLabel}
          type="button"
        >
          <Icon decorative name={iconName} size={18} tone={active ? "lime" : "default"} />
        </button>
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
