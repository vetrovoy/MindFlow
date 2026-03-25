const PROJECT_DECORATIONS = [
  { emoji: "🚀", color: "#7C3AED" },
  { emoji: "🧠", color: "#2563EB" },
  { emoji: "⚡", color: "#22C55E" },
  { emoji: "🗂", color: "#FA541C" }
] as const;

export function getProjectDecoration(index: number) {
  return PROJECT_DECORATIONS[index % PROJECT_DECORATIONS.length];
}
