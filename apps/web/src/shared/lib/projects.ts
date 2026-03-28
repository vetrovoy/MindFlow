import { projectMarkers } from "@mindflow/ui";

export const PROJECT_DECORATIONS = projectMarkers;

export type ProjectDecorationId = (typeof PROJECT_DECORATIONS)[number]["id"];

export function getProjectDecoration(index: number) {
  return PROJECT_DECORATIONS[index % PROJECT_DECORATIONS.length];
}

export function getProjectDecorationByColor(color: string) {
  return (
    PROJECT_DECORATIONS.find(
      (decoration) => decoration.color.toUpperCase() === color.toUpperCase()
    ) ?? PROJECT_DECORATIONS[0]
  );
}
