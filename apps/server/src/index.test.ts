import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { sign, verify } from "hono/jwt";

type Env = { Variables: JwtVariables };

// In-memory store
function createStore() {
  return {
    tasks: {} as Record<string, any>,
    projects: {} as Record<string, any>
  };
}

// Drizzle-like chain API (synchronous chain, async final)
function createDb(store: ReturnType<typeof createStore>) {
  return {
    select: () => ({
      from: (table: string) => {
        const s = table === "tasks" ? store.tasks : store.projects;
        return {
          where: async (cond: any) => {
            const id = cond?.value;
            if (id && s[id]) return [s[id]];
            return Object.values(s);
          },
          orderBy: async (_col?: any) => {
            return Object.values(s).sort((a: any, b: any) =>
              (a.createdAt ?? "").localeCompare(b.createdAt ?? "")
            );
          }
        };
      }
    }),
    insert: (table: string) => ({
      values: (body: any) => ({
        returning: async () => {
          const s = table === "tasks" ? store.tasks : store.projects;
          s[body.id] = { ...body };
          return [{ ...body }];
        }
      })
    }),
    update: (table: string) => ({
      set: (body: any) => ({
        where: (cond: any) => ({
          returning: async () => {
            const s = table === "tasks" ? store.tasks : store.projects;
            const id = cond?.value;
            if (!s[id]) return [];
            s[id] = { ...s[id], ...body };
            return [{ ...s[id] }];
          }
        })
      })
    }),
    delete: (table: string) => ({
      where: (cond: any) => ({
        returning: async () => {
          const s = table === "tasks" ? store.tasks : store.projects;
          const id = cond?.value;
          if (!s[id]) return [];
          const [removed] = [s[id]];
          delete s[id];
          return [removed];
        }
      })
    })
  };
}

const TEST_SECRET = "test-secret-for-unit-tests-must-be-32-chars-long!";

function authMiddleware() {
  return async (c: any, next: any) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.slice(7);
    try {
      const decoded = await verify(token, TEST_SECRET, "HS256");
      c.set("jwtPayload", decoded);
      await next();
    } catch {
      return c.json({ error: "Invalid or expired token" }, 401);
    }
  };
}

function registerAuthRoutes(app: Hono<Env>) {
  app.post("/api/auth/register", async (c) => {
    const { email, name, password } = await c.req.json();
    if (!email || !name || !password) {
      return c.json({ error: "email, name, and password are required" }, 400);
    }
    const token = await sign(
      {
        sub: "user-1",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
      },
      TEST_SECRET
    );
    return c.json({ token, user: { id: "user-1", email, name } }, 201);
  });

  app.post("/api/auth/login", async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "email and password are required" }, 400);
    }
    const token = await sign(
      {
        sub: "user-1",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
      },
      TEST_SECRET
    );
    return c.json({ token, user: { id: "user-1", email } });
  });
}

function createTestApp(store: ReturnType<typeof createStore>) {
  const db = createDb(store);
  const app = new Hono<Env>();
  app.onError((err: any, c: any) => {
    console.error(err);
    return c.json({ error: err.message ?? "Internal Server Error" }, 500);
  });

  registerAuthRoutes(app);

  const api = new Hono<Env>();
  api.use("*", authMiddleware());

  api.get("/api/tasks", async (c) => {
    const all = await db.select().from("tasks").orderBy("createdAt");
    return c.json(all);
  });

  api.get("/api/tasks/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.select().from("tasks").where({ value: id });
    if (result.length === 0) return c.json({ error: "Task not found" }, 404);
    return c.json(result[0]);
  });

  api.post("/api/tasks", async (c) => {
    const body = await c.req.json();
    if (!body.title) return c.json({ error: "title is required" }, 400);
    const result = await db.insert("tasks").values(body).returning();
    return c.json(result[0], 201);
  });

  api.put("/api/tasks/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const result = await db
      .update("tasks")
      .set(body)
      .where({ value: id })
      .returning();
    if (result.length === 0) return c.json({ error: "Task not found" }, 404);
    return c.json(result[0]);
  });

  api.delete("/api/tasks/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.delete("tasks").where({ value: id }).returning();
    if (result.length === 0) return c.json({ error: "Task not found" }, 404);
    return c.body(null, 204);
  });

  api.get("/api/projects", async (c) => {
    const all = await db.select().from("projects").orderBy("createdAt");
    return c.json(all);
  });

  api.get("/api/projects/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.select().from("projects").where({ value: id });
    if (result.length === 0) return c.json({ error: "Project not found" }, 404);
    return c.json(result[0]);
  });

  api.post("/api/projects", async (c) => {
    const body = await c.req.json();
    if (!body.name) return c.json({ error: "name is required" }, 400);
    const result = await db.insert("projects").values(body).returning();
    return c.json(result[0], 201);
  });

  api.put("/api/projects/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const result = await db
      .update("projects")
      .set(body)
      .where({ value: id })
      .returning();
    if (result.length === 0) return c.json({ error: "Project not found" }, 404);
    return c.json(result[0]);
  });

  api.delete("/api/projects/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.delete("projects").where({ value: id }).returning();
    if (result.length === 0) return c.json({ error: "Project not found" }, 404);
    return c.body(null, 204);
  });

  app.get("/health", (c) => c.json({ status: "ok" }));
  app.route("/", api);

  return app;
}

async function authHeaders(): Promise<{ Authorization: string }> {
  const token = await sign(
    {
      sub: "user-1",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400
    },
    TEST_SECRET
  );
  return { Authorization: `Bearer ${token}` };
}

describe("index.ts — CRUD API endpoints", () => {
  describe("health", () => {
    it("returns 200 ok", async () => {
      const app = createTestApp(createStore());
      const res = await app.request("/health");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { status?: string };
      expect(body.status).toBe("ok");
    });
  });

  describe("tasks CRUD", () => {
    it("returns 401 without auth token", async () => {
      const app = createTestApp(createStore());
      const res = await app.request("/api/tasks");
      expect(res.status).toBe(401);
    });

    it("creates, reads, updates, and deletes a task", async () => {
      const app = createTestApp(createStore());
      const headers = await authHeaders();
      const id = `task-${Date.now()}`;

      const createRes = await app.request("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ id, title: "Test task", status: "todo" })
      });
      expect(createRes.status).toBe(201);
      const created = (await createRes.json()) as { title?: string };
      expect(created.title).toBe("Test task");

      const listRes = await app.request("/api/tasks", { headers });
      expect(listRes.status).toBe(200);

      const getRes = await app.request(`/api/tasks/${id}`, { headers });
      expect(getRes.status).toBe(200);

      const updateRes = await app.request(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ title: "Updated task" })
      });
      expect(updateRes.status).toBe(200);

      const deleteRes = await app.request(`/api/tasks/${id}`, {
        method: "DELETE",
        headers
      });
      expect(deleteRes.status).toBe(204);

      const getAfterRes = await app.request(`/api/tasks/${id}`, { headers });
      expect(getAfterRes.status).toBe(404);
    });

    it("returns 400 when creating task without title", async () => {
      const app = createTestApp(createStore());
      const headers = await authHeaders();
      const res = await app.request("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ status: "todo" })
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toContain("title");
    });

    it("returns 404 when updating non-existent task", async () => {
      const app = createTestApp(createStore());
      const headers = await authHeaders();
      const res = await app.request("/api/tasks/nonexistent", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ title: "Nope" })
      });
      expect(res.status).toBe(404);
    });
  });

  describe("projects CRUD", () => {
    it("returns 401 without auth token", async () => {
      const app = createTestApp(createStore());
      const res = await app.request("/api/projects");
      expect(res.status).toBe(401);
    });

    it("creates, reads, updates, and deletes a project", async () => {
      const app = createTestApp(createStore());
      const headers = await authHeaders();
      const id = `proj-${Date.now()}`;

      const createRes = await app.request("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          id,
          name: "Test project",
          color: "#FF0000",
          emoji: "🧪"
        })
      });
      expect(createRes.status).toBe(201);
      const created = (await createRes.json()) as { name?: string };
      expect(created.name).toBe("Test project");

      const listRes = await app.request("/api/projects", { headers });
      expect(listRes.status).toBe(200);

      const updateRes = await app.request(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ name: "Updated project" })
      });
      expect(updateRes.status).toBe(200);

      const deleteRes = await app.request(`/api/projects/${id}`, {
        method: "DELETE",
        headers
      });
      expect(deleteRes.status).toBe(204);

      const getAfterRes = await app.request(`/api/projects/${id}`, {
        headers
      });
      expect(getAfterRes.status).toBe(404);
    });

    it("returns 400 when creating project without name", async () => {
      const app = createTestApp(createStore());
      const headers = await authHeaders();
      const res = await app.request("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ color: "#FF0000" })
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toContain("name");
    });

    it("returns 404 when deleting non-existent project", async () => {
      const app = createTestApp(createStore());
      const headers = await authHeaders();
      const res = await app.request("/api/projects/nonexistent", {
        method: "DELETE",
        headers
      });
      expect(res.status).toBe(404);
    });
  });
});
