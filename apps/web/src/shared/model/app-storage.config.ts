export const LEGACY_DATABASE_NAME = "mindflow-web";
export const APP_DATABASE_NAME = "planner-local";

export function getUserDatabaseName(userId: string) {
  return `${APP_DATABASE_NAME}:${userId}`;
}

export function getLegacyUserDatabaseName(userId: string) {
  return `${LEGACY_DATABASE_NAME}:${userId}`;
}
