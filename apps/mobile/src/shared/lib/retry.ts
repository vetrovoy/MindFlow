const DEFAULT_MAX_ATTEMPTS = 2;
const DEFAULT_BACKOFF_MS = 300;

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxAttempts?: number;
    backoffMs?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  },
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const backoffMs = options?.backoffMs ?? DEFAULT_BACKOFF_MS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        options?.onRetry?.(attempt, error);
        // Exponential backoff: 300ms, 600ms, 1200ms, …
        await new Promise(resolve =>
          setTimeout(resolve, backoffMs * 2 ** (attempt - 1)),
        );
      }
    }
  }

  throw lastError;
}
