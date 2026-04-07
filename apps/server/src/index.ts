import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { JwtVariables } from "hono/jwt";
import { tasks, projects } from "./db/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { authMiddleware, registerAuthRoutes } from "./auth";

type Env = { Variables: JwtVariables };

// Validate required env vars at startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    "FATAL: JWT_SECRET is required and must be at least 32 characters"
  );
  process.exit(1);
}

const app = new Hono<Env>();

app.use("*", logger());
app.use("*", cors());

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message ?? "Internal Server Error" }, 500);
});

// ─── Auth routes (no auth required) ─────────────────────────────────────────

registerAuthRoutes(app);

// ─── Protected CRUD routes ──────────────────────────────────────────────────

const api = new Hono<Env>();
api.use("*", authMiddleware);

// Tasks
api.get("/api/tasks", async (c) => {
  const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);
  return c.json(allTasks);
});

api.get("/api/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }
  return c.json(result[0]);
});

api.post("/api/tasks", async (c) => {
  const body = await c.req.json();
  if (!body.title) {
    return c.json({ error: "title is required" }, 400);
  }
  const result = await db.insert(tasks).values(body).returning();
  return c.json(result[0], 201);
});

api.put("/api/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = await db
    .update(tasks)
    .set(body)
    .where(eq(tasks.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }
  return c.json(result[0]);
});

api.delete("/api/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }
  return c.body(null, 204);
});

// Projects
api.get("/api/projects", async (c) => {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(projects.createdAt);
  return c.json(allProjects);
});

api.get("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(projects).where(eq(projects.id, id));
  if (result.length === 0) {
    return c.json({ error: "Project not found" }, 404);
  }
  return c.json(result[0]);
});

api.post("/api/projects", async (c) => {
  const body = await c.req.json();
  if (!body.name) {
    return c.json({ error: "name is required" }, 400);
  }
  const result = await db.insert(projects).values(body).returning();
  return c.json(result[0], 201);
});

api.put("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = await db
    .update(projects)
    .set(body)
    .where(eq(projects.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: "Project not found" }, 404);
  }
  return c.json(result[0]);
});

api.delete("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();
  if (result.length === 0) {
    return c.json({ error: "Project not found" }, 404);
  }
  return c.body(null, 204);
});

app.route("/", api);

// ─── Health ──────────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT ?? "3000", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
