export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `planner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
