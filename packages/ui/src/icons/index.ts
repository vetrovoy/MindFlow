export const ICON_NAMES = [
  "add",
  "archive",
  "check",
  "checkbox-empty",
  "checkbox-checked",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "priority-low",
  "priority-medium",
  "priority-high",
  "restore",
  "search",
  "today",
  "overdue",
  "toast-success",
  "close",
  "favorite",
  "flag",
  "language",
  "palette",
  "nav-inbox",
  "nav-lists",
  "nav-today",
  "sign-out",
  "drag",
  "eye",
  "eye-off",
  "more",
  "trash"
] as const;

export type IconName = (typeof ICON_NAMES)[number];
export type IconTone =
  | "default"
  | "muted"
  | "accent"
  | "alert"
  | "success"
  | "contrast";

export interface IconProps {
  name: IconName;
  size?: number;
  tone?: IconTone;
  decorative?: boolean;
}

export function isIconName(value: string): value is IconName {
  return ICON_NAMES.includes(value as IconName);
}
