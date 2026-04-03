import { describe, expect, it } from "vitest";

import type { Project, Task } from "./types";
import {
  archiveProject,
  archiveTask,
  buildTodayFeed,
  bulkMoveToProject,
  createProject,
  createTask,
  getProjectProgress,
  restoreProject,
  setTaskStatus,
  searchEntities,
  toggleTaskDone,
  updateProject,
  updateTask
} from "./index";

const NOW = "2026-03-25T09:00:00.000Z";
const TODAY = "2026-03-25";

function makeTask(overrides: Partial<Task> = {}): Task {
  return createTask({
    id: overrides.id ?? crypto.randomUUID(),
    title: overrides.title ?? "Task",
    now: overrides.createdAt ?? NOW,
    priority: overrides.priority,
    dueDate: overrides.dueDate,
    projectId: overrides.projectId,
    orderIndex: overrides.orderIndex
  });
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return createProject({
    id: overrides.id ?? crypto.randomUUID(),
    name: overrides.name ?? "Project",
    color: overrides.color ?? "#000000",
    emoji: overrides.emoji ?? "🚀",
    now: overrides.createdAt ?? NOW,
    isFavorite: overrides.isFavorite,
    deadline: overrides.deadline
  });
}

describe("buildTodayFeed", () => {
  it("groups tasks by the documented Today bucket order", () => {
    const tasks = [
      makeTask({
        id: "high-inbox",
        title: "Inbox high",
        projectId: null,
        priority: "high",
        createdAt: "2026-03-25T09:03:00.000Z"
      }),
      makeTask({
        id: "due-today",
        title: "Due today",
        projectId: "project-a",
        dueDate: TODAY,
        priority: "low",
        createdAt: "2026-03-25T09:02:00.000Z"
      }),
      makeTask({
        id: "overdue",
        title: "Overdue",
        projectId: "project-a",
        dueDate: "2026-03-24",
        priority: "medium",
        createdAt: "2026-03-25T09:01:00.000Z"
      })
    ];

    const result = buildTodayFeed(tasks, TODAY);

    expect(result.map((entry) => entry.task.id)).toEqual([
      "overdue",
      "due-today",
      "high-inbox"
    ]);
  });

  it("excludes done and archived tasks", () => {
    const doneTask = toggleTaskDone(
      makeTask({ id: "done-task", dueDate: TODAY, projectId: "project-a" }),
      NOW
    );
    const archived = archiveTask(
      makeTask({ id: "archived-task", dueDate: TODAY, projectId: "project-a" }),
      NOW
    );
    const active = makeTask({
      id: "active-task",
      dueDate: TODAY,
      projectId: "project-a"
    });

    const result = buildTodayFeed([doneTask, archived, active], TODAY);

    expect(result.map((entry) => entry.task.id)).toEqual(["active-task"]);
  });
});

describe("archive semantics", () => {
  it("restoring a project keeps separately archived tasks archived", () => {
    const archivedProject = archiveProject(
      makeProject({ id: "project-a" }),
      "2026-03-25T09:10:00.000Z"
    );
    const restoredProject = restoreProject(
      archivedProject,
      "2026-03-25T09:15:00.000Z"
    );
    const separatelyArchivedTask = archiveTask(
      makeTask({ id: "task-a", projectId: "project-a" }),
      "2026-03-25T09:12:00.000Z"
    );

    expect(restoredProject.archivedAt).toBeNull();
    expect(separatelyArchivedTask.archivedAt).toBe("2026-03-25T09:12:00.000Z");
  });
});

describe("getProjectProgress", () => {
  it("ignores archived tasks and counts done tasks", () => {
    const doneTask = toggleTaskDone(
      makeTask({ id: "done", projectId: "project-a" }),
      NOW
    );
    const todoTask = makeTask({ id: "todo", projectId: "project-a" });
    const archivedTask = archiveTask(
      makeTask({ id: "archived", projectId: "project-a" }),
      NOW
    );

    expect(getProjectProgress([doneTask, todoTask, archivedTask], "project-a")).toEqual(
      {
        done: 1,
        total: 2,
        ratio: 0.5
      }
    );
  });
});

describe("bulkMoveToProject", () => {
  it("preserves selected Inbox ordering intent", () => {
    const tasks = [
      makeTask({ id: "task-1", projectId: null, orderIndex: 5 }),
      makeTask({ id: "task-2", projectId: null, orderIndex: 10 }),
      makeTask({ id: "task-3", projectId: null, orderIndex: 15 })
    ];

    const moved = bulkMoveToProject(
      tasks,
      ["task-3", "task-1"],
      "project-a",
      "2026-03-25T10:00:00.000Z"
    );

    expect(moved.map((task) => [task.id, task.orderIndex, task.projectId])).toEqual([
      ["task-3", 0, "project-a"],
      ["task-1", 1, "project-a"]
    ]);
  });
});

describe("searchEntities", () => {
  it("searches only active tasks and active projects", () => {
    const activeTask = makeTask({ id: "task-a", title: "Landing page" });
    const archivedTask = archiveTask(
      makeTask({ id: "task-b", title: "Landing archive" }),
      NOW
    );
    const activeProject = makeProject({ id: "project-a", name: "Landing MVP" });
    const archivedProject = archiveProject(
      makeProject({ id: "project-b", name: "Landing Archive" }),
      NOW
    );

    const result = searchEntities(
      [activeTask, archivedTask],
      [activeProject, archivedProject],
      "landing"
    );

    expect(result.tasks.map((task) => task.id)).toEqual(["task-a"]);
    expect(result.projects.map((project) => project.id)).toEqual(["project-a"]);
  });

  it("excludes tasks whose parent project is archived", () => {
    const archivedProject = archiveProject(
      makeProject({ id: "project-a", name: "Landing Archive" }),
      NOW
    );
    const nestedTask = makeTask({
      id: "task-a",
      title: "Landing nested task",
      projectId: archivedProject.id
    });
    const inboxTask = makeTask({ id: "task-b", title: "Landing inbox" });

    const result = searchEntities(
      [nestedTask, inboxTask],
      [archivedProject],
      "landing"
    );

    expect(result.tasks.map((task) => task.id)).toEqual(["task-b"]);
    expect(result.projects).toEqual([]);
  });
});

describe("task editing helpers", () => {
  it("normalizes description updates", () => {
    const task = makeTask({ id: "task-a", description: null });

    const updated = updateTask(
      task,
      {
        description: "   Уточнить copy для hero   "
      },
      NOW
    );

    expect(updated.description).toBe("Уточнить copy для hero");
  });

  it("sets completedAt when status becomes done", () => {
    const task = makeTask({ id: "task-a" });

    const updated = setTaskStatus(task, "done", "2026-03-25T10:00:00.000Z");

    expect(updated.status).toBe("done");
    expect(updated.completedAt).toBe("2026-03-25T10:00:00.000Z");
  });

  it("normalizes project name updates", () => {
    const project = makeProject({ id: "project-a", name: "Landing" });

    const updated = updateProject(
      project,
      {
        name: "  Новый список  ",
        isFavorite: true
      },
      NOW
    );

    expect(updated.name).toBe("Новый список");
    expect(updated.isFavorite).toBe(true);
  });
});
