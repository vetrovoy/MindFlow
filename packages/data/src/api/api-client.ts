const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        // Don't retry on client errors (4xx) — they won't change on retry
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Check if this is a client error (4xx) that shouldn't be retried
      if (lastError.message.includes("HTTP 4")) {
        throw lastError;
      }
      if (attempt < retries) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw lastError ?? new Error("Unknown fetch error");
}

export async function apiGet<T>(
  baseUrl: string,
  path: string,
  token: string
): Promise<T> {
  const normalizedUrl = baseUrl.replace(/\/+$/, "");
  const response = await fetchWithRetry(`${normalizedUrl}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return (await response.json()) as T;
}

export async function apiPost<T>(
  baseUrl: string,
  path: string,
  body: unknown,
  token: string
): Promise<T> {
  const normalizedUrl = baseUrl.replace(/\/+$/, "");
  const response = await fetchWithRetry(`${normalizedUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return (await response.json()) as T;
}

export async function apiPut<T>(
  baseUrl: string,
  path: string,
  body: unknown,
  token: string
): Promise<T> {
  const normalizedUrl = baseUrl.replace(/\/+$/, "");
  const response = await fetchWithRetry(`${normalizedUrl}${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return (await response.json()) as T;
}

export async function apiDelete(
  baseUrl: string,
  path: string,
  token: string
): Promise<void> {
  const normalizedUrl = baseUrl.replace(/\/+$/, "");
  await fetchWithRetry(`${normalizedUrl}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}
