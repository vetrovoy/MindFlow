import { SCHEMA_VERSION } from "./constants";

// Migration SQL strings are embedded here for simplicity.
// For large projects, consider loading from .sql files at build time.

const MIGRATIONS: string[] = [
  // 001_initial.sql
  `
    CREATE TABLE IF NOT EXISTS tasks (
      id          TEXT    PRIMARY KEY NOT NULL,
      title       TEXT    NOT NULL,
      description TEXT,
      status      TEXT    NOT NULL DEFAULT 'todo',
      priority    TEXT    NOT NULL DEFAULT 'medium',
      dueDate     TEXT,
      projectId   TEXT,
      orderIndex  REAL    NOT NULL DEFAULT 0,
      createdAt   TEXT    NOT NULL,
      updatedAt   TEXT    NOT NULL,
      completedAt TEXT,
      archivedAt  TEXT
    );
    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT    PRIMARY KEY NOT NULL,
      name        TEXT    NOT NULL,
      color       TEXT    NOT NULL,
      emoji       TEXT    NOT NULL,
      isFavorite  INTEGER NOT NULL DEFAULT 0,
      deadline    TEXT,
      createdAt   TEXT    NOT NULL,
      updatedAt   TEXT    NOT NULL,
      archivedAt  TEXT
    );
  `,
  // 002_add_sync_columns.sql
  `
    ALTER TABLE tasks ADD COLUMN isDirty INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE tasks ADD COLUMN changeType TEXT;
    ALTER TABLE projects ADD COLUMN isDirty INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE projects ADD COLUMN changeType TEXT;
  `
];

/**
 * Runs all pending migrations in a single transaction.
 * Uses PRAGMA user_version to track the current schema version.
 */
export async function runMigrations(db: {
  execute: (query: string, params?: unknown[]) => Promise<{ rows?: unknown[] }>;
  executeSync: (query: string, params?: unknown[]) => void;
}): Promise<void> {
  const currentVersionResult = await db.execute("PRAGMA user_version");
  const currentVersion =
    (currentVersionResult.rows?.[0] as Record<string, unknown>)?.user_version ??
    0;
  const currentVersionNum = Number(currentVersion);

  if (currentVersionNum >= SCHEMA_VERSION) {
    return; // Already up to date
  }

  console.log(
    `[SQLite] Migrating schema from v${currentVersionNum} to v${SCHEMA_VERSION}...`
  );

  try {
    // Begin transaction
    await db.execute("BEGIN TRANSACTION");

    for (let i = currentVersionNum; i < SCHEMA_VERSION; i++) {
      const migrationIndex = i; // 0-based index
      if (migrationIndex >= MIGRATIONS.length) {
        throw new Error(`Missing migration for version ${migrationIndex + 1}`);
      }

      const sql = MIGRATIONS[migrationIndex];
      console.log(`[SQLite] Applying migration v${migrationIndex + 1}...`);
      db.executeSync(sql);
    }

    // Update schema version
    await db.execute(`PRAGMA user_version = ${SCHEMA_VERSION}`);

    // Commit transaction
    await db.execute("COMMIT");

    console.log(`[SQLite] Schema migrated to v${SCHEMA_VERSION}.`);
  } catch (error) {
    // Rollback on failure
    try {
      await db.execute("ROLLBACK");
    } catch {
      // Ignore rollback errors
    }
    throw new Error(
      `Migration failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
