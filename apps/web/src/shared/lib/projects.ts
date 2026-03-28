export const PROJECT_DECORATIONS = [
  { id: "violet", emoji: "🚀", color: "#7C3AED" },
  { id: "blue", emoji: "🧠", color: "#2563EB" },
  { id: "green", emoji: "⚡", color: "#22C55E" },
  { id: "orange", emoji: "🗂", color: "#FA541C" }
] as const;

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
