import type { TaskPriority } from "@mindflow/domain";

export type ButtonVariant = "primary" | "secondary";
export type TaskCheckboxState = "unchecked" | "checked";
export type StatusBadgeVariant = "today" | "overdue";
export type FeedbackCardVariant = "error" | "loading" | "empty";
export type InlineStatusVariant = "loading" | "error";

export interface ButtonProps {
  variant: ButtonVariant;
  label: string;
  disabled?: boolean;
}

export interface TaskInputProps {
  value: string;
  placeholder?: string;
}

export interface TaskCheckboxProps {
  state: TaskCheckboxState;
  disabled?: boolean;
}

export interface PriorityBadgeProps {
  priority: TaskPriority;
}

export interface ProgressBarProps {
  value: number;
  max: number;
}

export interface TaskRowProps {
  id: string;
  title: string;
  priority: TaskPriority;
  checkbox: TaskCheckboxState;
  selected?: boolean;
  dueDate?: string | null;
}

export interface ProjectCardProps {
  id: string;
  name: string;
  emoji: string;
  progress: ProgressBarProps;
  isFavorite?: boolean;
}

export interface SearchFieldProps {
  value: string;
  placeholder?: string;
}

export interface BottomNavItemProps {
  label: string;
  active: boolean;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
}

export interface TaskEditModalProps {
  title: string;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
  canArchive?: boolean;
  canRestore?: boolean;
}

export interface ToastProps {
  title: string;
  description?: string;
}

export interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export interface ArchiveRowProps {
  title: string;
  subtitle?: string;
}

export interface FeedbackCardProps {
  variant: FeedbackCardVariant;
  title: string;
  description?: string;
}

export interface InlineStatusProps {
  variant: InlineStatusVariant;
  label: string;
}

export interface TooltipProps {
  label: string;
}
