import type { ChangeType, PendingChange } from "../contracts";

export type { ChangeType, PendingChange };

export class PendingChangesQueue {
  private changes: Map<string, PendingChange> = new Map();

  /**
   * Record a mutation for later sync.
   * If entity is already marked as 'created', subsequent updates keep it as 'created'.
   */
  record(
    entity: "task" | "project",
    id: string,
    type: ChangeType,
    data?: Record<string, unknown>
  ): void {
    const key = `${entity}:${id}`;
    const existing = this.changes.get(key);

    if (existing) {
      if (existing.type === "created" && type === "deleted") {
        // Entity was created then deleted — remove from queue entirely
        this.changes.delete(key);
        return;
      }
      if (existing.type === "created" && type === "updated") {
        // Entity was created then updated — merge data, keep as 'created'
        existing.data = { ...existing.data, ...data };
        existing.timestamp = Date.now();
        return;
      }
    }

    this.changes.set(key, {
      entity,
      id,
      type,
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Get all pending changes, sorted by timestamp (oldest first).
   */
  getAll(): PendingChange[] {
    return Array.from(this.changes.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }

  /**
   * Get changes for a specific entity type.
   */
  getForEntity(entity: "task" | "project"): PendingChange[] {
    return this.getAll().filter((c) => c.entity === entity);
  }

  /**
   * Mark specific changes as synced (remove from queue).
   */
  markSynced(changes: PendingChange[]): void {
    for (const change of changes) {
      const key = `${change.entity}:${change.id}`;
      this.changes.delete(key);
    }
  }

  /**
   * Clear all pending changes.
   */
  clear(): void {
    this.changes.clear();
  }

  /**
   * Check if there are any pending changes.
   */
  hasPending(): boolean {
    return this.changes.size > 0;
  }

  /**
   * Get count of pending changes.
   */
  getPendingCount(): number {
    return this.changes.size;
  }
}
