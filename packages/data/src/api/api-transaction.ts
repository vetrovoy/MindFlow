import type { Transaction } from "../contracts";

/**
 * No-op transaction for API-based repositories.
 * Each API call is atomic on the server side, so we can't
 * wrap multiple calls in a client-side transaction.
 */
export class ApiTransaction implements Transaction {
  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}
