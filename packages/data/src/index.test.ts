import { describe, expect, it } from "vitest";

import {
  archiveProject,
  archiveTask,
  createProject,
  createTask
} from "@mindflow/domain";

import { createInMemoryRepositoryBundle } from "./in-memory/repository";

const NOW = "2026-03-25T09:00:00.000Z";

describe("createInMemoryRepositoryBundle", () => {
  it("lists active and archived tasks separately", async () => {
    const activeTask = createTask({
      id: "task-active",
      title: "Active task",
      now: NOW
    });
    const archivedTask = archiveTask(
      createTask({
        id: "task-archived",
        title: "Archived task",
        now: NOW
      }),
      "2026-03-25T09:05:00.000Z"
    );

    const bundle = createInMemoryRepositoryBundle({
      tasks: [activeTask, archivedTask]
    });

    await expect(bundle.tasks.listActive()).resolves.toEqual([activeTask]);
    await expect(bundle.tasks.listArchived()).resolves.toEqual([archivedTask]);
  });

  it("lists active and archived projects separately", async () => {
    const activeProject = createProject({
      id: "project-active",
      name: "Active project",
      color: "#000000",
      emoji: "🚀",
      now: NOW
    });
    const archivedProject = archiveProject(
      createProject({
        id: "project-archived",
        name: "Archived project",
        color: "#111111",
        emoji: "📦",
        now: NOW
      }),
      "2026-03-25T09:05:00.000Z"
    );

    const bundle = createInMemoryRepositoryBundle({
      projects: [activeProject, archivedProject]
    });

    await expect(bundle.projects.listActive()).resolves.toEqual([
      activeProject
    ]);
    await expect(bundle.projects.listArchived()).resolves.toEqual([
      archivedProject
    ]);
  });

  it("persists saved entities and supports getById", async () => {
    const bundle = createInMemoryRepositoryBundle();
    const task = createTask({
      id: "task-save",
      title: "Saved task",
      now: NOW
    });

    await bundle.tasks.save(task);

    await expect(bundle.tasks.getById("task-save")).resolves.toEqual(task);
  });

  it("deletes tasks from the repository", async () => {
    const bundle = createInMemoryRepositoryBundle();
    const task = createTask({
      id: "task-delete",
      title: "Delete me",
      now: NOW
    });

    await bundle.tasks.save(task);
    await bundle.tasks.delete(task.id);

    await expect(bundle.tasks.getById(task.id)).resolves.toBeNull();
  });

  it("runs work through the transaction boundary", async () => {
    const bundle = createInMemoryRepositoryBundle();

    await expect(
      bundle.transaction.run(async () => {
        const project = createProject({
          id: "project-save",
          name: "Saved project",
          color: "#222222",
          emoji: "🧠",
          now: NOW
        });

        await bundle.projects.save(project);

        return bundle.projects.getById(project.id);
      })
    ).resolves.toEqual(
      createProject({
        id: "project-save",
        name: "Saved project",
        color: "#222222",
        emoji: "🧠",
        now: NOW
      })
    );
  });
});
