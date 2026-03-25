import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ArrowRight,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  Circle,
  FolderKanban,
  LayoutGrid,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  X,
  TriangleAlert
} from "lucide-react";

import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

export type IconName =
  | "add"
  | "archive"
  | "check"
  | "checkbox-empty"
  | "checkbox-checked"
  | "chevron-right"
  | "priority-low"
  | "priority-medium"
  | "priority-high"
  | "search"
  | "today"
  | "overdue"
  | "toast-success"
  | "close"
  | "nav-inbox"
  | "nav-lists"
  | "nav-today";

export interface IconProps {
  name: IconName;
  size?: number;
  tone?: "default" | "muted" | "lime" | "alert" | "success" | "contrast";
  decorative?: boolean;
  className?: string;
}

const ICONS: Record<IconName, LucideIcon> = {
  add: Plus,
  archive: Archive,
  check: Check,
  "checkbox-empty": Circle,
  "checkbox-checked": CheckCircle2,
  "chevron-right": ArrowRight,
  "priority-low": Circle,
  "priority-medium": Calendar,
  "priority-high": TriangleAlert,
  search: Search,
  today: Calendar,
  overdue: CalendarClock,
  "toast-success": Sparkles,
  close: X,
  "nav-inbox": ListTodo,
  "nav-lists": FolderKanban,
  "nav-today": LayoutGrid
};

export function Icon({
  className,
  decorative = true,
  name,
  size = 18,
  tone = "default"
}: IconProps) {
  const Component = ICONS[name];
  
  return (
    <Component
      aria-hidden={decorative}
      className={cn(
        styles.icon,
        tone === "muted" && styles.toneMuted,
        tone === "lime" && styles.toneLime,
        tone === "alert" && styles.toneAlert,
        tone === "success" && styles.toneSuccess,
        tone === "contrast" && styles.toneContrast,
        className
      )}
      size={size}
      strokeWidth={2}
    />
  );
}
