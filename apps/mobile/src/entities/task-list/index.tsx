import { getProgressValue, type ThemeName, tokens } from "@mindflow/ui";

import { useTheme } from "../../app/providers/theme-provider";

function getThemeLabel(theme: ThemeName) {
  switch (theme) {
    case "graphite":
      return "Graphite";
    case "gilded":
      return "Gilded";
    case "minimal":
      return "Minimal";
  }
}

export function TaskListEntity() {
  const { definition, theme } = useTheme();
  const progress = getProgressValue({ value: 2, max: 5 });

  return `Task planner mobile shell is ready for ACP-83 (${Math.round(progress * 100)}% demo progress). Theme: ${getThemeLabel(theme)}. Accent: ${definition.colors.accentPrimary}. Font role: ${tokens.typography.fontFamily.body}.`;
}
