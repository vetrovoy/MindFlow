import { formatDisplayDate, type AppLanguage, type CopyDictionary } from "@mindflow/copy";

import { PROJECT_DECORATIONS } from "@/shared/lib/projects";

export function getProjectColorLabel(copy: CopyDictionary, color: string) {
  const decoration = PROJECT_DECORATIONS.find((option) => option.color === color);

  if (decoration == null) {
    return copy.project.defaultMarkerLabel;
  }

  return copy.project.colors[decoration.id];
}

export function formatProjectDeadlineLabel(
  copy: CopyDictionary,
  language: AppLanguage,
  deadline: string
) {
  return deadline ? formatDisplayDate(deadline, language) : copy.project.noDeadline;
}
