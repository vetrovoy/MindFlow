export function getNowIso(now = new Date()): string {
  return now.toISOString();
}
