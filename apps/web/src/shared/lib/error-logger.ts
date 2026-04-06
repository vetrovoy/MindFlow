export interface ErrorContext {
  action?: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, unknown>;
}

export function logError(error: unknown, context?: ErrorContext): void {
  const prefix = context?.action ? `[Error: ${context.action}]` : "[Error]";
  const details: Record<string, unknown> = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  };

  if (context?.entityType) details.entityType = context.entityType;
  if (context?.entityId) details.entityId = context.entityId;
  if (context?.metadata) details.metadata = context.metadata;

  // Currently logs to console — Sentry hook goes here later
  console.error(prefix, details);
}
