import { describe, it, expect, vi } from "vitest";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { authMiddleware, registerAuthRoutes } from "./auth";

type Env = { Variables: JwtVariables };

// Mock db to avoid requiring PostgreSQL in tests
vi.mock("./db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([])
      })
    }),
    insert: () => ({
      values: () => ({
        returning: () =>
          Promise.resolve([
            { id: "user-1", email: "test@test.com", name: "Test" }
          ])
      })
    })
  }
}));

// Set JWT_SECRET for tests
process.env.JWT_SECRET = "test-secret-for-unit-tests-must-be-32-chars-long!";

describe("auth middleware", () => {
  it("returns 401 when no Authorization header", async () => {
    const app = new Hono<Env>();
    app.use("/api/test", authMiddleware);
    app.get("/api/test", (c) => c.json({ ok: true }));

    const res = await app.request("/api/test");
    expect(res.status).toBe(401);
  });

  it("returns 401 when Authorization header is not Bearer", async () => {
    const app = new Hono<Env>();
    app.use("/api/test", authMiddleware);
    app.get("/api/test", (c) => c.json({ ok: true }));

    const res = await app.request("/api/test", {
      headers: { Authorization: "Basic abc" }
    });
    expect(res.status).toBe(401);
  });

  it("returns 401 when token is invalid", async () => {
    const app = new Hono<Env>();
    app.use("/api/test", authMiddleware);
    app.get("/api/test", (c) => c.json({ ok: true }));

    const res = await app.request("/api/test", {
      headers: { Authorization: "Bearer invalid-token" }
    });
    expect(res.status).toBe(401);
  });
});

describe("auth routes registration", () => {
  it("registers /api/auth/register and /api/auth/login endpoints", () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    expect(app.routes.some((r) => r.path === "/api/auth/register")).toBe(true);
    expect(app.routes.some((r) => r.path === "/api/auth/login")).toBe(true);
  });

  it("returns 400 when register body is missing required fields", async () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain("required");
  });

  it("returns 400 when login body is missing fields", async () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain("required");
  });

  it("returns 400 when password is too short", async () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        name: "Test",
        password: "short"
      })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain("8 characters");
  });

  it("returns 400 when password is too long", async () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        name: "Test",
        password: "a".repeat(129)
      })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain("128 characters");
  });

  it("returns 400 when email format is invalid", async () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        name: "Test",
        password: "password123"
      })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain("email");
  });

  it("returns 400 when name is empty after trim", async () => {
    const app = new Hono<Env>();
    registerAuthRoutes(app);

    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        name: "   ",
        password: "password123"
      })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain("Name");
  });
});

describe("health endpoint", () => {
  it("returns ok status", async () => {
    const app = new Hono();
    app.get("/health", (c) => c.json({ status: "ok" }));

    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status?: string };
    expect(body.status).toBe("ok");
  });
});
