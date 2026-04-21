/**
 * Standalone migration script — runs Drizzle migrations then exits.
 * Used by Docker entrypoint before starting the server.
 *
 * Usage: node dist/migrate.js
 */
import dotenv from "dotenv";

// Only load .env in development (when not in Docker)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./db/schema";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const url =
    process.env.DATABASE_URL ??
    "postgresql://mindflow:mindflow@localhost:5432/mindflow";

  console.log("Running database migrations...");

  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, "..", "drizzle")
  });

  await sql.end();
  console.log("Migrations complete.");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
