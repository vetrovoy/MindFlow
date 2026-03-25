export function getTaskCountCopy(count: number) {
  if (count === 1) {
    return "задача";
  }

  if (count < 5) {
    return "задачи";
  }

  return "задач";
}
