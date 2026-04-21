import type { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign, verify } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./db/schema";

type Env = { Variables: JwtVariables };

const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY_SECONDS = 86400; // 24 hours
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function issueToken(userId: string): Promise<string> {
  return sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS
    },
    getJwtSecret()
  );
}

export const authMiddleware: MiddlewareHandler<Env> = async (
  c: Context<Env>,
  next: Next
) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await verify(token, getJwtSecret(), "HS256");
    c.set("jwtPayload", decoded);
    await next();
  } catch {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }
};

export function getAuthUserId(c: Context<Env>): string {
  const payload = c.get("jwtPayload");
  if (typeof payload?.sub !== "string") {
    throw new HTTPException(401, { message: "Invalid token payload" });
  }
  return payload.sub;
}

async function parseJson(
  c: Context<Env>
): Promise<Record<string, unknown> | Response> {
  try {
    return (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
}

export function registerAuthRoutes(app: {
  post: (path: string, handler: (c: Context<Env>) => Promise<Response>) => void;
}) {
  // POST /api/auth/register
  app.post("/api/auth/register", async (c: Context<Env>) => {
    const body = await parseJson(c);
    if ("status" in body && !(body as any).token) return body as Response;

    const { email, name, password } = body as {
      email?: unknown;
      name?: unknown;
      password?: unknown;
    };

    if (
      typeof email !== "string" ||
      typeof name !== "string" ||
      typeof password !== "string"
    ) {
      return c.json({ error: "email, name, and password are required" }, 400);
    }

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 100) {
      return c.json({ error: "Name must be 1-100 characters" }, 400);
    }

    if (!EMAIL_REGEX.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    if (password.length < 8 || password.length > 128) {
      return c.json({ error: "Password must be 8-128 characters" }, 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const now = new Date();
    const crypto = await import("node:crypto");
    const id = crypto.randomUUID();

    let result;
    try {
      result = await db
        .insert(users)
        .values({
          id,
          email: normalizedEmail,
          name: trimmedName,
          passwordHash,
          createdAt: now,
          updatedAt: now
        })
        .returning();
    } catch (err: unknown) {
      // Handle unique constraint violation (TOCTOU-safe)
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code: string }).code === "23505"
      ) {
        return c.json({ error: "Email already registered" }, 409);
      }
      throw err;
    }

    const token = await issueToken(result[0].id);

    return c.json(
      {
        token,
        user: {
          id: result[0].id,
          email: result[0].email,
          name: result[0].name
        }
      },
      201
    );
  });

  // POST /api/auth/login
  app.post("/api/auth/login", async (c: Context<Env>) => {
    const body = await parseJson(c);
    if ("status" in body && !(body as any).token) return body as Response;

    const { email, password } = body as {
      email?: unknown;
      password?: unknown;
    };

    if (typeof email !== "string" || typeof password !== "string") {
      return c.json({ error: "email and password are required" }, 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (result.length === 0) {
      console.log(`[auth/login] User not found: ${normalizedEmail}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const isValid = await verifyPassword(password, result[0].passwordHash);
    if (!isValid) {
      console.log(`[auth/login] Wrong password for: ${normalizedEmail}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    console.log(`[auth/login] Success: ${normalizedEmail}`);

    const token = await issueToken(result[0].id);

    return c.json({
      token,
      user: {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name
      }
    });
  });
}
