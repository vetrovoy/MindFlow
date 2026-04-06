import type { ReactNode } from "react";

import { DockPopover, type IconName } from "@/shared/ui";

interface ProjectDockPopoverProps {
  iconName: IconName;
  triggerLabel: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function ProjectDockPopover({
  active = false,
  children,
  className,
  iconName,
  triggerLabel
}: ProjectDockPopoverProps) {
  return (
    <DockPopover
      active={active}
      iconName={iconName}
      triggerClassName={className}
      triggerLabel={triggerLabel}
    >
      {children}
    </DockPopover>
  );
}
