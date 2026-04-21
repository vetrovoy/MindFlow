import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { JwtVariables } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { tasks, projects } from "./db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { authMiddleware, getAuthUserId, registerAuthRoutes } from "./auth";

type Env = { Variables: JwtVariables };

export function createApp() {
  const app = new Hono<Env>();

  app.use("*", logger());

  // Custom logger with request/response bodies
  app.use("*", async (c, next) => {
    const start = Date.now();
    const method = c.req.method;
    const path = c.req.path;
    const timestamp = new Date().toISOString();

    console.log(`\n[${timestamp}] <-- ${method} ${path}`);

    // Log CORS preflight headers for OPTIONS
    if (method === "OPTIONS") {
      const corsHeaders = {
        "access-control-request-method": c.req.header(
          "access-control-request-method"
        ),
        "access-control-request-headers": c.req.header(
          "access-control-request-headers"
        ),
        origin: c.req.header("origin")
      };
      console.log("CORS Preflight Check:");
      console.log(JSON.stringify(corsHeaders, null, 2));
    }

    // Log request body for POST/PUT/PATCH (using cloned request)
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        const contentType = c.req.header("content-type");
        if (contentType?.includes("application/json")) {
          const clonedReq = c.req.raw.clone();
          const bodyText = await clonedReq.text();
          if (bodyText) {
            const body = JSON.parse(bodyText);
            // Mask sensitive fields before logging
            const sanitized = { ...body };
            if ("password" in sanitized) sanitized.password = "***";
            console.log("Request Body:");
            console.log(JSON.stringify(sanitized, null, 2));
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;
    console.log(
      `[${timestamp}] --> ${method} ${path} [${status}] ${duration}ms`
    );
  });

  app.use(
    "*",
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : "*"
    })
  );

  app.onError((err, c) => {
    // Preserve HTTPException status codes (401, 400, etc.)
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status as any);
    }

    console.error(err);
    return c.json({ error: err.message ?? "Internal Server Error" }, 500);
  });

  // ─── Auth routes (no auth required) ─────────────────────────────────────────
  registerAuthRoutes(app);

  // ─── Health check (no auth required) ────────────────────────────────────────
  app.get("/health", (c) => c.json({ status: "ok" }));

  // ─── Protected CRUD routes ──────────────────────────────────────────────────
  const api = new Hono<Env>();
  api.use("*", authMiddleware);

  // Tasks
  api.get("/api/tasks", async (c) => {
    const userId = getAuthUserId(c);
    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(tasks.createdAt);
    return c.json(allTasks);
  });

  api.get("/api/tasks/:id", async (c) => {
    const userId = getAuthUserId(c);
    const id = c.req.param("id");
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    if (result.length === 0) {
      return c.json({ error: "Task not found" }, 404);
    }
    return c.json(result[0]);
  });

  api.post("/api/tasks", async (c) => {
    const userId = getAuthUserId(c);
    const body = await c.req.json();
    if (!body.title) {
      return c.json({ error: "title is required" }, 400);
    }
    const taskData = normalizeTaskDates({ ...body, userId });

    // Check if task with this ID already exists
    const existing = body.id
      ? await db.select().from(tasks).where(eq(tasks.id, body.id))
      : [];

    if (existing.length > 0) {
      // Existing task — verify ownership before updating
      if (existing[0].userId !== userId) {
        return c.json({ error: "Forbidden" }, 403);
      }
      const { userId: _, ...updateData } = taskData;
      const result = await db
        .update(tasks)
        .set(updateData)
        .where(and(eq(tasks.id, body.id), eq(tasks.userId, userId)))
        .returning();
      return c.json(result[0]);
    }

    // New task — insert
    const result = await db
      .insert(tasks)
      .values(taskData as typeof tasks.$inferInsert)
      .returning();
    return c.json(result[0], 201);
  });

  api.put("/api/tasks/:id", async (c) => {
    const userId = getAuthUserId(c);
    const id = c.req.param("id");
    const body = await c.req.json();
    const d = normalizeTaskDates(body);
    const result = await db
      .update(tasks)
      .set(d)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    if (result.length === 0) {
      return c.json({ error: "Task not found" }, 404);
    }
    return c.json(result[0]);
  });

  api.delete("/api/tasks/:id", async (c) => {
    const userId = getAuthUserId(c);
    const id = c.req.param("id");
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    if (result.length === 0) {
      return c.json({ error: "Task not found" }, 404);
    }
    return c.body(null, 204);
  });

  // Projects
  api.get("/api/projects", async (c) => {
    const userId = getAuthUserId(c);
    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(projects.createdAt);
    return c.json(allProjects);
  });

  api.get("/api/projects/:id", async (c) => {
    const userId = getAuthUserId(c);
    const id = c.req.param("id");
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    if (result.length === 0) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.json(result[0]);
  });

  api.post("/api/projects", async (c) => {
    const userId = getAuthUserId(c);
    const body = await c.req.json();
    if (!body.name) {
      return c.json({ error: "name is required" }, 400);
    }
    const projectData = normalizeProjectDates({ ...body, userId });

    // Check if project with this ID already exists
    const existing = body.id
      ? await db.select().from(projects).where(eq(projects.id, body.id))
      : [];

    if (existing.length > 0) {
      // Existing project — verify ownership before updating
      if (existing[0].userId !== userId) {
        return c.json({ error: "Forbidden" }, 403);
      }
      const { userId: _, ...updateData } = projectData;
      const result = await db
        .update(projects)
        .set(updateData)
        .where(and(eq(projects.id, body.id), eq(projects.userId, userId)))
        .returning();
      return c.json(result[0]);
    }

    // New project — insert
    const result = await db
      .insert(projects)
      .values(projectData as typeof projects.$inferInsert)
      .returning();
    return c.json(result[0], 201);
  });

  api.put("/api/projects/:id", async (c) => {
    const userId = getAuthUserId(c);
    const id = c.req.param("id");
    const body = await c.req.json();
    const d = normalizeProjectDates(body);
    const result = await db
      .update(projects)
      .set(d)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    if (result.length === 0) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.json(result[0]);
  });

  api.delete("/api/projects/:id", async (c) => {
    const userId = getAuthUserId(c);
    const id = c.req.param("id");
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    if (result.length === 0) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.body(null, 204);
  });

  app.route("/", api);

  return app;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeDates<T extends Record<string, unknown>>(
  body: T,
  dateFields: (keyof T)[]
): T {
  const result = { ...body };
  for (const field of dateFields) {
    const value = result[field];
    if (value != null && typeof value === "string") {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        result[field] = parsed as T[typeof field];
      }
    }
  }
  return result;
}

function normalizeTaskDates(body: Record<string, unknown>) {
  return normalizeDates(body, [
    "createdAt",
    "updatedAt",
    "completedAt",
    "archivedAt",
    "dueDate"
  ]);
}

function normalizeProjectDates(body: Record<string, unknown>) {
  return normalizeDates(body, [
    "createdAt",
    "updatedAt",
    "archivedAt",
    "deadline"
  ]);
}
