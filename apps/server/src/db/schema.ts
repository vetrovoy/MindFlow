import {
  boolean,
  doublePrecision,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"),
  priority: text("priority").notNull().default("medium"),
  dueDate: timestamp("dueDate"),
  projectId: text("projectId"),
  orderIndex: doublePrecision("orderIndex").notNull().default(0),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  completedAt: timestamp("completedAt"),
  archivedAt: timestamp("archivedAt")
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  emoji: text("emoji").notNull(),
  isFavorite: boolean("isFavorite").notNull().default(false),
  deadline: timestamp("deadline"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  archivedAt: timestamp("archivedAt")
});
