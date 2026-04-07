import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { tasks, projects } from "./db/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message ?? "Internal Server Error" }, 500);
});

// ─── Tasks ───────────────────────────────────────────────────────────────────

app.get("/api/tasks", async (c) => {
  const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);
  return c.json(allTasks);
});

app.get("/api/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }
  return c.json(result[0]);
});

app.post("/api/tasks", async (c) => {
  const body = await c.req.json();
  if (!body.title) {
    return c.json({ error: "title is required" }, 400);
  }
  const result = await db.insert(tasks).values(body).returning();
  return c.json(result[0], 201);
});

app.put("/api/tasks/:id", async (c) => {
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

app.delete("/api/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }
  return c.body(null, 204);
});

// ─── Projects ────────────────────────────────────────────────────────────────

app.get("/api/projects", async (c) => {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(projects.createdAt);
  return c.json(allProjects);
});

app.get("/api/projects/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(projects).where(eq(projects.id, id));
  if (result.length === 0) {
    return c.json({ error: "Project not found" }, 404);
  }
  return c.json(result[0]);
});

app.post("/api/projects", async (c) => {
  const body = await c.req.json();
  if (!body.name) {
    return c.json({ error: "name is required" }, 400);
  }
  const result = await db.insert(projects).values(body).returning();
  return c.json(result[0], 201);
});

app.put("/api/projects/:id", async (c) => {
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

app.delete("/api/projects/:id", async (c) => {
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

// ─── Health ──────────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT ?? "3000", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
