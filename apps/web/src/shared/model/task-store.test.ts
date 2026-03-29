import { createInMemoryRepositoryBundle, type RepositoryBundle } from "@mindflow/data";
import { createProject, createTask } from "@mindflow/domain";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createAppStore } from "./task-store";

const NOW = "2026-03-29T12:00:00.000Z";

function createRepositoryFactory(bundle: RepositoryBundle) {
  return () => bundle;
}

describe("createAppStore", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps project tasks hidden while the project is archived and restores them with the project", async () => {
    const project = createProject({
      id: "project-a",
      name: "Planner polish",
      color: "#7CFFB2",
      emoji: "✦",
      now: NOW
    });
    const task = createTask({
      id: "task-a",
      title: "Refine archive surface",
      projectId: project.id,
      now: NOW,
      orderIndex: 0
    });
    const store = createAppStore("test-store", {
      repositoryFactory: createRepositoryFactory(
        createInMemoryRepositoryBundle({
          projects: [project],
          tasks: [task]
        })
      )
    });

    await store.getState().actions.reload();
    expect(store.getState().derived.projectSections).toHaveLength(1);
    expect(store.getState().derived.projectSections[0]?.tasks.map((entry) => entry.id)).toEqual([
      "task-a"
    ]);

    await store.getState().actions.archiveProject(project.id);
    expect(store.getState().derived.projectSections).toHaveLength(0);
    expect(store.getState().derived.regularProjects).toHaveLength(0);

    await store.getState().actions.restoreProject(project.id);
    expect(store.getState().derived.projectSections).toHaveLength(1);
    expect(store.getState().derived.projectSections[0]?.tasks.map((entry) => entry.id)).toEqual([
      "task-a"
    ]);
    expect(store.getState().state.toast?.title).toBeTruthy();
  });

  it("hydrates into an error state when snapshot reads fail", async () => {
    const failingRepository: RepositoryBundle = {
      tasks: {
        getById: async () => null,
        listAll: async () => {
          throw new Error("Snapshot read failed");
        },
        listActive: async () => [],
        listArchived: async () => [],
        delete: async () => {},
        save: async (task) => task,
        saveMany: async (tasks) => tasks
      },
      projects: {
        getById: async () => null,
        listAll: async () => [],
        listActive: async () => [],
        listArchived: async () => [],
        save: async (project) => project,
        saveMany: async (projects) => projects
      },
      transaction: {
        run: async (work) => work()
      },
      sync: {
        push: async () => {},
        pull: async () => {}
      }
    };
    const store = createAppStore("test-store", {
      repositoryFactory: createRepositoryFactory(failingRepository)
    });

    await store.getState().actions.reload();

    expect(store.getState().state.isHydrated).toBe(true);
    expect(store.getState().state.error).toBe("Snapshot read failed");
  });

  it("auto-dismisses success toasts after the timeout", async () => {
    vi.useFakeTimers();

    const store = createAppStore("test-store", {
      repositoryFactory: createRepositoryFactory(createInMemoryRepositoryBundle())
    });

    await store.getState().actions.reload();
    await store.getState().actions.addInboxTask({ title: "Write hardening tests" });

    expect(store.getState().state.toast?.title).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2600);

    expect(store.getState().state.toast).toBeNull();
  });
});
