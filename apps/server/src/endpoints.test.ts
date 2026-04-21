import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { AddressInfo } from "net";
import { serve, type ServerType } from "@hono/node-server";
import { inArray } from "drizzle-orm";
import { createApp } from "./app";
import { db } from "./db";
import { users, tasks, projects } from "./db/schema";

const TEST_EMAILS = [
  "test@example.com",
  "new@example.com",
  "other@example.com"
];

let server: ServerType;
let baseUrl: string;
let authToken: string;

beforeAll(async () => {
  // Clean up test users and their data from previous runs
  const existingUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.email, TEST_EMAILS));

  if (existingUsers.length > 0) {
    const userIds = existingUsers.map((u) => u.id);
    await db.delete(tasks).where(inArray(tasks.userId, userIds));
    await db.delete(projects).where(inArray(projects.userId, userIds));
    await db.delete(users).where(inArray(users.email, TEST_EMAILS));
  }

  const app = createApp();
  server = serve({ fetch: app.fetch, port: 0 });
  const port = (server.address() as AddressInfo)?.port;
  baseUrl = `http://localhost:${port}`;

  // Register a test user
  const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      name: "Test User",
      password: "password123"
    })
  });

  expect(registerRes.status).toBe(201);
  const registerBody = (await registerRes.json()) as Record<string, any>;
  authToken = registerBody.token;
});

afterAll(async () => {
  // Clean up test data
  const existingUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.email, TEST_EMAILS));

  if (existingUsers.length > 0) {
    const userIds = existingUsers.map((u) => u.id);
    await db.delete(tasks).where(inArray(tasks.userId, userIds));
    await db.delete(projects).where(inArray(projects.userId, userIds));
    await db.delete(users).where(inArray(users.email, TEST_EMAILS));
  }

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

function authHeaders() {
  return {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json"
  };
}

describe("Integration: Auth endpoints", () => {
  it("POST /api/auth/register — creates user and returns token", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "new@example.com",
        name: "New User",
        password: "newpassword123"
      })
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, any>;
    expect(body).toHaveProperty("token");
    expect(body.user).toHaveProperty("email", "new@example.com");
  });

  it("POST /api/auth/register — rejects duplicate email", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        name: "Test User 2",
        password: "password456"
      })
    });

    expect(res.status).toBe(409);
  });

  it("POST /api/auth/register — rejects missing fields", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com" })
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login — returns token for valid credentials", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123"
      })
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, any>;
    expect(body).toHaveProperty("token");
  });

  it("POST /api/auth/login — rejects wrong password", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword"
      })
    });

    expect(res.status).toBe(401);
  });
});

describe("Integration: Tasks CRUD", () => {
  it("GET /api/tasks — returns 401 without token", async () => {
    const res = await fetch(`${baseUrl}/api/tasks`);
    expect(res.status).toBe(401);
  });

  it("POST /api/tasks — creates task with string dates", async () => {
    const now = new Date().toISOString();
    const task = {
      id: `task-integration-${Date.now()}`,
      title: "Integration Test Task",
      description: "Test description",
      status: "todo",
      priority: "medium",
      createdAt: now,
      updatedAt: now
    };

    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(task)
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, any>;
    expect(body.title).toBe("Integration Test Task");
    expect(body.id).toBe(task.id);
  });

  it("POST /api/tasks — handles duplicate ID (upsert)", async () => {
    const taskId = `task-dup-${Date.now()}`;
    const now = new Date().toISOString();
    const task = {
      id: taskId,
      title: "First version",
      status: "todo",
      createdAt: now,
      updatedAt: now
    };

    // First create
    const res1 = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(task)
    });
    expect(res1.status).toBe(201);

    // Second create with same ID — should NOT fail (upsert → update returns 200)
    const task2 = {
      ...task,
      title: "Updated version",
      updatedAt: new Date().toISOString()
    };
    const res2 = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(task2)
    });
    expect(res2.status).toBe(200);

    const body = (await res2.json()) as Record<string, any>;
    expect(body.title).toBe("Updated version");
  });

  it("GET /api/tasks/:id — returns 404 for non-existent", async () => {
    const res = await fetch(`${baseUrl}/api/tasks/non-existent-id`, {
      headers: authHeaders()
    });
    expect(res.status).toBe(404);
  });

  it("PUT /api/tasks/:id — updates task", async () => {
    const taskId = `task-update-${Date.now()}`;
    const now = new Date().toISOString();

    // Create
    await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        id: taskId,
        title: "Update me",
        status: "todo",
        createdAt: now,
        updatedAt: now
      })
    });

    // Update
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        title: "Updated title",
        status: "done",
        updatedAt: new Date().toISOString()
      })
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, any>;
    expect(body.title).toBe("Updated title");
    expect(body.status).toBe("done");
  });

  it("DELETE /api/tasks/:id — returns 204", async () => {
    const taskId = `task-delete-${Date.now()}`;
    const now = new Date().toISOString();

    // Create
    await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        id: taskId,
        title: "Delete me",
        status: "todo",
        createdAt: now,
        updatedAt: now
      })
    });

    // Delete
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: authHeaders()
    });
    expect(res.status).toBe(204);

    // Verify deleted
    const getRes = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
      headers: authHeaders()
    });
    expect(getRes.status).toBe(404);
  });
});

describe("Integration: Projects CRUD", () => {
  it("POST /api/projects — creates project with string dates", async () => {
    const now = new Date().toISOString();
    const project = {
      id: `proj-integration-${Date.now()}`,
      name: "Integration Test Project",
      color: "#FF0000",
      emoji: "🧪",
      createdAt: now,
      updatedAt: now
    };

    const res = await fetch(`${baseUrl}/api/projects`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(project)
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, any>;
    expect(body.name).toBe("Integration Test Project");
  });

  it("POST /api/projects — handles duplicate ID (upsert)", async () => {
    const projId = `proj-dup-${Date.now()}`;
    const now = new Date().toISOString();

    // First create
    const res1 = await fetch(`${baseUrl}/api/projects`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        id: projId,
        name: "First",
        color: "#00FF00",
        emoji: "📦",
        createdAt: now,
        updatedAt: now
      })
    });
    expect(res1.status).toBe(201);

    // Second create with same ID — upsert → update returns 200
    const res2 = await fetch(`${baseUrl}/api/projects`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        id: projId,
        name: "Updated",
        color: "#0000FF",
        emoji: "📦",
        createdAt: now,
        updatedAt: new Date().toISOString()
      })
    });
    expect(res2.status).toBe(200);

    const body = (await res2.json()) as Record<string, any>;
    expect(body.name).toBe("Updated");
  });
});

describe("Integration: Health check", () => {
  it("GET /health — returns ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, any>;
    expect(body).toEqual({ status: "ok" });
  });
});

describe("Integration: User data isolation", () => {
  let otherToken: string;

  beforeAll(async () => {
    // Register a second user
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "other@example.com",
        name: "Other User",
        password: "password123"
      })
    });
    const body = (await res.json()) as Record<string, any>;
    otherToken = body.token;
  });

  it("user A cannot see user B tasks", async () => {
    const now = new Date().toISOString();

    // User A creates a task
    await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        id: `task-isolation-${Date.now()}`,
        title: "User A private task",
        status: "todo",
        createdAt: now,
        updatedAt: now
      })
    });

    // User B lists tasks — should not see user A's task
    const res = await fetch(`${baseUrl}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${otherToken}`,
        "Content-Type": "application/json"
      }
    });
    const tasks = (await res.json()) as any[];
    const found = tasks.find((t) => t.title === "User A private task");
    expect(found).toBeUndefined();
  });
});
