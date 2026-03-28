export type ProjectMarkerContrastTone = "light" | "dark";

export const projectMarkers = [
  { id: "violet", emoji: "🚀", color: "#7C3AED", contrastTone: "light" },
  { id: "blue", emoji: "🧠", color: "#2563EB", contrastTone: "light" },
  { id: "green", emoji: "⚡", color: "#22C55E", contrastTone: "dark" },
  { id: "orange", emoji: "🗂", color: "#FA541C", contrastTone: "light" }
] as const satisfies readonly {
  id: string;
  emoji: string;
  color: string;
  contrastTone: ProjectMarkerContrastTone;
}[];

export type ProjectMarkerId = (typeof projectMarkers)[number]["id"];
