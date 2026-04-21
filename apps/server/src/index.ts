import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { createApp } from "./app";

// Only load .env in development (when not in Docker)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Validate required env vars at startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    "FATAL: JWT_SECRET is required and must be at least 32 characters"
  );
  process.exit(1);
}

const app = createApp();
const port = parseInt(process.env.PORT ?? "3000", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
