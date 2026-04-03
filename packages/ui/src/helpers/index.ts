import type {
  FeedbackCardProps,
  ProgressBarProps,
  TaskRowProps,
  TaskCheckboxState
} from "../contracts";

export function getProgressValue({ value, max }: ProgressBarProps) {
  if (max <= 0) {
    return 0;
  }

  const normalized = value / max;
  return Math.max(0, Math.min(1, normalized));
}

export function getTaskRowStateLabel(props: TaskRowProps) {
  if (props.selected) {
    return "selected";
  }

  return props.checkbox;
}

export function getCheckboxStateLabel(state: TaskCheckboxState) {
  return state === "checked" ? "Done" : "Todo";
}

export function getFeedbackCardRole(props: FeedbackCardProps) {
  return props.variant === "error" ? "alert" : "status";
}
