/**
 * Auth use-cases.
 * Pure functions — no I/O. Side effects handled by the caller.
 */

import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

/**
 * Validates login input. Returns error message or null.
 */
export function validateLogin(input: LoginRequest): string | null {
  if (!input.email || !input.password) {
    return "Email and password are required";
  }
  if (!isValidEmail(input.email)) {
    return "Invalid email format";
  }
  return null;
}

/**
 * Validates register input. Returns error message or null.
 */
export function validateRegister(input: RegisterRequest): string | null {
  if (!input.email || !input.name || !input.password) {
    return "Email, name, and password are required";
  }
  if (!isValidEmail(input.email)) {
    return "Invalid email format";
  }
  if (input.name.trim().length < 1 || input.name.length > 100) {
    return "Name must be 1-100 characters";
  }
  if (input.password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

/**
 * Creates an auth response from raw token and user data.
 */
export function createAuthResponse(
  token: string,
  user: { id: string; email: string; name: string }
): AuthResponse {
  return { token, user };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
