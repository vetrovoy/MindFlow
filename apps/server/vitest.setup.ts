import { PostgreSqlContainer } from "@testcontainers/postgresql";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./src/db/schema";
import * as path from "path";

export async function setup() {
  console.log("Starting PostgreSQL container...");

  const container = await new PostgreSqlContainer("postgres:17-alpine")
    .withDatabase("mindflow_test")
    .withUsername("mindflow")
    .withPassword("mindflow")
    .withExposedPorts(5432)
    .start();

  const dbUrl = container.getConnectionUri();
  console.log(`PostgreSQL ready: ${dbUrl}`);

  // Set required env vars for the server
  process.env.DATABASE_URL = dbUrl;
  process.env.JWT_SECRET = "test-jwt-secret-must-be-at-least-32-chars!!!";
  process.env.PORT = "0";

  // Run migrations
  const sql = postgres(dbUrl, { max: 1 });
  const db = drizzle(sql, { schema });
  await migrate(db, { migrationsFolder: path.resolve(__dirname, "drizzle") });
  await sql.end();

  // Return teardown function
  return async function teardown() {
    console.log("Stopping PostgreSQL container...");
    await container.stop();
    console.log("PostgreSQL stopped.");
  };
}
