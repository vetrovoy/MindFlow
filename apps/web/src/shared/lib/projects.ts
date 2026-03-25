export const PROJECT_DECORATIONS = [
  { emoji: "🚀", color: "#7C3AED", label: "Фиолетовый" },
  { emoji: "🧠", color: "#2563EB", label: "Синий" },
  { emoji: "⚡", color: "#22C55E", label: "Зелёный" },
  { emoji: "🗂", color: "#FA541C", label: "Оранжевый" }
] as const;

export function getProjectDecoration(index: number) {
  return PROJECT_DECORATIONS[index % PROJECT_DECORATIONS.length];
}
