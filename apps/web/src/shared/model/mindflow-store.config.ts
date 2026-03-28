export const LEGACY_MINDFLOW_DATABASE_NAME = "mindflow-web";

export function getMindFlowDatabaseName(userId: string) {
  return `${LEGACY_MINDFLOW_DATABASE_NAME}:${userId}`;
}
