/**
 * Auth API client for mobile and web.
 * Uses fetch with timeout — no Hono dependencies.
 */

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from "@mindflow/domain";

export interface AuthClientOptions {
  baseUrl: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeoutMs?: number;
}

/**
 * Typed HTTP error thrown for non-OK responses.
 * Allows callers to distinguish auth errors (4xx) from network errors.
 */
export class AuthHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "AuthHttpError";
  }

  /** True for 401/403 — wrong credentials or forbidden */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** True for 409 — email already registered */
  get isConflict(): boolean {
    return this.status === 409;
  }

  /** True for any 4xx — client error, should NOT fallback to local auth */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export class AuthClient {
  private readonly timeoutMs: number;

  constructor(private readonly options: AuthClientOptions) {
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetchWithTimeout(
      `${this.options.baseUrl}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      },
      this.timeoutMs
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AuthHttpError(
        (error as Record<string, string>).error ??
          `Login failed: ${response.status}`,
        response.status
      );
    }

    return (await response.json()) as AuthResponse;
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await fetchWithTimeout(
      `${this.options.baseUrl}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      },
      this.timeoutMs
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AuthHttpError(
        (error as Record<string, string>).error ??
          `Register failed: ${response.status}`,
        response.status
      );
    }

    return (await response.json()) as AuthResponse;
  }
}
