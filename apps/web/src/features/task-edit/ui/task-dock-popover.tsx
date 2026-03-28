import type { ReactNode } from "react";

import { DockPopover, type IconName } from "@/shared/ui";

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
    <DockPopover
      active={active}
      iconName={iconName}
      triggerClassName={className}
      triggerLabel={triggerLabel}>
      {children}
    </DockPopover>
  );
}
