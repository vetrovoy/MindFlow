import type { ReactNode } from "react";

import { DockPopover } from "@/shared/ui";

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
    <DockPopover
      active={active}
      iconName={iconName}
      triggerLabel={triggerLabel}
    >
      {children}
    </DockPopover>
  );
}
