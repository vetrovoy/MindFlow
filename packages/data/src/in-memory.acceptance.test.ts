import { describe, expect, it, beforeEach } from "vitest";

import { createInMemoryRepositoryBundle } from "./in-memory/repository";
import { createTask, createProject } from "@mindflow/domain";

describe("Acceptance: Task Management Flows", () => {
  const repo = createInMemoryRepositoryBundle();

  beforeEach(async () => {
    const tasks = await repo.tasks.listAll();
    await Promise.all(tasks.map(t => repo.tasks.delete(t.id)));
  });

  const now = new Date().toISOString();

  it("Create task flow: task is created and persisted", async () => {
    const task = createTask({
      id: `task-test-${Date.now()}`,
      title: "Test task",
      now,
      description: null,
      priority: "medium",
      dueDate: null,
      projectId: null,
      orderIndex: 0
    });

    const saved = await repo.tasks.save(task);

    expect(saved.id).toBe(task.id);
    expect(saved.title).toBe("Test task");
    expect(saved.archivedAt).toBeNull();

    const retrieved = await repo.tasks.getById(task.id);
    expect(retrieved).toEqual(saved);
  });

  it("Complete task flow: task status changes to done", async () => {
    const task = createTask({
      id: `task-test-${Date.now()}-1`,
      title: "Complete me",
      now,
      description: null,
      priority: "medium",
      dueDate: null,
      projectId: null,
      orderIndex: 0
    });

    await repo.tasks.save(task);

    const completed = { ...task, status: "done" as const, updatedAt: new Date().toISOString() };
    await repo.tasks.save(completed);

    const retrieved = await repo.tasks.getById(task.id);
    expect(retrieved?.status).toBe("done");

    const allTasks = await repo.tasks.listAll();
    expect(allTasks.some(t => t.id === task.id)).toBe(true);
  });

  it("Archive/restore flow: task is archived and restored", async () => {
    const task = createTask({
      id: `task-test-${Date.now()}-2`,
      title: "Archive me",
      now,
      description: null,
      priority: "medium",
      dueDate: null,
      projectId: null,
      orderIndex: 0
    });

    await repo.tasks.save(task);

    const archived = { ...task, archivedAt: new Date().toISOString() };
    await repo.tasks.save(archived);

    const archivedTasks = await repo.tasks.listArchived();
    expect(archivedTasks.some(t => t.id === task.id)).toBe(true);

    const restored = { ...task, archivedAt: null };
    await repo.tasks.save(restored);

    const retrieved = await repo.tasks.getById(task.id);
    expect(retrieved?.archivedAt).toBeNull();

    const activeTasks = await repo.tasks.listActive();
    expect(activeTasks.some(t => t.id === task.id)).toBe(true);
  });

  it("Project flow: project with tasks is created and progress calculated", async () => {
    const now = new Date().toISOString();
    const project = createProject({
      id: `project-test-${Date.now()}`,
      name: "Test project",
      color: "#FF0000",
      emoji: "📁",
      now,
      isFavorite: false,
      deadline: null
    });

    await repo.projects.save(project);

    const task1 = createTask({
      id: `task-test-${Date.now()}-3`,
      title: "Task 1",
      now,
      description: null,
      priority: "medium",
      dueDate: null,
      projectId: project.id,
      orderIndex: 0
    });

    const task2 = createTask({
      id: `task-test-${Date.now()}-4`,
      title: "Task 2",
      now,
      description: null,
      priority: "medium",
      dueDate: null,
      projectId: project.id,
      orderIndex: 1
    });

    await repo.tasks.saveMany([task1, task2]);

    const task2Completed = { ...task2, status: "done" as const, updatedAt: new Date().toISOString() };
    await repo.tasks.save(task2Completed);

    const allProjectTasks = await repo.tasks.listAll();
    const doneCount = allProjectTasks.filter(t => t.projectId === project.id && t.status === "done").length;
    const totalCount = allProjectTasks.filter(t => t.projectId === project.id).length;

    expect(totalCount).toBe(2);
    expect(doneCount).toBe(1);
  });
});
