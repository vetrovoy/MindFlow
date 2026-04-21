/**
 * Runs in every test worker process BEFORE test files are collected.
 * Loads .env so DATABASE_URL / JWT_SECRET are available.
 */
import dotenv from "dotenv";

dotenv.config();
