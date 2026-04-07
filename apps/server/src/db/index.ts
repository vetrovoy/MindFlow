import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(
  process.env.DATABASE_URL ??
    "postgresql://mindflow:mindflow@localhost:5432/mindflow"
);

export const db = drizzle(client, { schema });
