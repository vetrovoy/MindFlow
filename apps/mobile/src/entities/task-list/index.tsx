import { getProgressValue, tokens } from "@mindflow/ui";

export function TaskListEntity() {
  const progress = getProgressValue({ value: 2, max: 5 });

  return `MindFlow mobile shell is ready for ACP-83 (${Math.round(progress * 100)}% demo progress). Font role: ${tokens.typography.fontFamily.body}.`;
}
