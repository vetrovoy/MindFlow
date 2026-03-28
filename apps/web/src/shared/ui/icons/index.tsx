import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Calendar,
  CalendarDays,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Eye,
  EyeOff,
  Flag,
  FolderKanban,
  GripVertical,
  Languages,
  ListTodo,
  LogOut,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

export type IconName =
  | "add"
  | "archive"
  | "check"
  | "checkbox-empty"
  | "checkbox-checked"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "priority-low"
  | "priority-medium"
  | "priority-high"
  | "search"
  | "today"
  | "overdue"
  | "toast-success"
  | "close"
  | "favorite"
  | "flag"
  | "language"
  | "palette"
  | "nav-inbox"
  | "nav-lists"
  | "nav-today"
  | "sign-out"
  | "drag"
  | "eye"
  | "eye-off"
  | "more"
  | "trash";

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
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  eye: Eye,
  "eye-off": EyeOff,
  "priority-low": Flag,
  "priority-medium": Flag,
  "priority-high": Flag,
  search: Search,
  today: Calendar,
  overdue: CalendarClock,
  "toast-success": CheckCircle2,
  close: X,
  favorite: Star,
  flag: Flag,
  language: Languages,
  palette: Palette,
  "nav-inbox": ListTodo,
  "nav-lists": FolderKanban,
  "nav-today": CalendarDays,
  "sign-out": LogOut,
  drag: GripVertical,
  more: MoreHorizontal,
  trash: Trash2
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
