import {
  boolean,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull()
});

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    color: text("color").notNull(),
    emoji: text("emoji").notNull(),
    isFavorite: boolean("isFavorite").notNull().default(false),
    userId: text("userId").references(() => users.id),
    deadline: timestamp("deadline"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    archivedAt: timestamp("archivedAt")
  },
  (table) => [index("projects_userId_idx").on(table.userId)]
);

export const tasks = pgTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull().default("todo"),
    priority: text("priority").notNull().default("medium"),
    dueDate: timestamp("dueDate"),
    projectId: text("projectId").references(() => projects.id, {
      onDelete: "set null"
    }),
    userId: text("userId").references(() => users.id),
    orderIndex: doublePrecision("orderIndex").notNull().default(0),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    completedAt: timestamp("completedAt"),
    archivedAt: timestamp("archivedAt")
  },
  (table) => [
    index("tasks_userId_idx").on(table.userId),
    index("tasks_projectId_idx").on(table.projectId)
  ]
);
