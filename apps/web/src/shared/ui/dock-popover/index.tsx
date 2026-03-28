import * as Popover from "@radix-ui/react-popover";
import { useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon, type IconName } from "@/shared/ui/icons";
import styles from "./index.module.css";

interface DockPopoverProps {
  iconName: IconName;
  triggerLabel: string;
  children: ReactNode;
  active?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
}

export function DockPopover({
  active = false,
  arrowClassName,
  children,
  contentClassName,
  iconName,
  triggerClassName,
  triggerLabel
}: DockPopoverProps) {
  const [open, setOpen] = useState(false);
  const isHighlighted = active || open;

  return (
    <Popover.Root onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>
        <button
          aria-label={triggerLabel}
          className={cn(
            styles.trigger,
            isHighlighted && styles.triggerActive,
            triggerClassName
          )}
          title={triggerLabel}
          type="button"
        >
          <Icon decorative name={iconName} size={18} tone={isHighlighted ? "lime" : "default"} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className={cn(styles.content, contentClassName)}
          side="top"
          sideOffset={12}
        >
          {children}
          <Popover.Arrow className={cn(styles.arrow, arrowClassName)} height={10} width={18} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
