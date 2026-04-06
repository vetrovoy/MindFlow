import * as Popover from "@radix-ui/react-popover";
import { type ButtonHTMLAttributes, useState, type ReactNode } from "react";

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

interface DockIconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  iconName: IconName;
  active?: boolean;
  className?: string;
}

export function DockIconButton({
  active = false,
  className,
  iconName,
  type = "button",
  ...props
}: DockIconButtonProps) {
  return (
    <button
      className={cn(styles.trigger, active && styles.triggerActive, className)}
      type={type}
      {...props}
    >
      <Icon
        decorative
        name={iconName}
        size={18}
        tone={active ? "accent" : "default"}
      />
    </button>
  );
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
        <DockIconButton
          active={isHighlighted}
          aria-label={triggerLabel}
          className={triggerClassName}
          iconName={iconName}
          title={triggerLabel}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className={cn(styles.content, contentClassName)}
          side="top"
          sideOffset={12}
        >
          {children}
          <Popover.Arrow
            className={cn(styles.arrow, arrowClassName)}
            height={10}
            width={18}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
