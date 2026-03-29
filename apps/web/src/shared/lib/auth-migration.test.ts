import { createInMemoryRepositoryBundle } from "@mindflow/data";
import { archiveTask, createProject, createTask } from "@mindflow/domain";
import { describe, expect, it } from "vitest";

import { LEGACY_DATABASE_NAME, getLegacyUserDatabaseName, getUserDatabaseName } from "@/shared/model/app-storage.config";
import { migrateLegacyAnonymousData } from "./auth-migration";

const NOW = "2026-03-29T12:00:00.000Z";

function createRepositoryRegistry() {
  const bundles = new Map<string, ReturnType<typeof createInMemoryRepositoryBundle>>();

  return {
    repositoryFactory({ name }: { name: string }) {
      const existing = bundles.get(name);
      if (existing != null) {
        return existing;
      }

      const created = createInMemoryRepositoryBundle();
      bundles.set(name, created);
      return created;
    },
    get(name: string) {
      return bundles.get(name);
    }
  };
}

describe("migrateLegacyAnonymousData", () => {
  it("merges legacy anonymous and legacy per-user data into the new per-user database", async () => {
    const registry = createRepositoryRegistry();
    const userId = "user-1";
    const legacyProject = createProject({
      id: "project-legacy",
      name: "Legacy inbox cleanup",
      color: "#7CFFB2",
      emoji: "✦",
      now: NOW
    });
    const legacyTask = createTask({
      id: "task-legacy",
      title: "Legacy anonymous task",
      projectId: legacyProject.id,
      now: NOW,
      orderIndex: 0
    });
    const legacyUserTask = archiveTask(
      createTask({
        id: "task-legacy-user",
        title: "Legacy user task",
        now: NOW,
        orderIndex: 1
      }),
      NOW
    );

    await registry
      .repositoryFactory({ name: LEGACY_DATABASE_NAME })
      .projects.save(legacyProject);
    await registry
      .repositoryFactory({ name: LEGACY_DATABASE_NAME })
      .tasks.save(legacyTask);
    await registry
      .repositoryFactory({ name: getLegacyUserDatabaseName(userId) })
      .tasks.save(legacyUserTask);

    await migrateLegacyAnonymousData(userId, {
      repositoryFactory: registry.repositoryFactory
    });

    const userRepository = registry.get(getUserDatabaseName(userId));
    expect(userRepository).toBeDefined();
    await expect(userRepository?.projects.listAll()).resolves.toEqual([legacyProject]);
    await expect(userRepository?.tasks.listAll()).resolves.toEqual([
      legacyTask,
      legacyUserTask
    ]);
  });

  it("skips duplicate ids that already exist in the target per-user database", async () => {
    const registry = createRepositoryRegistry();
    const userId = "user-1";
    const duplicateProject = createProject({
      id: "project-1",
      name: "Existing target project",
      color: "#7CFFB2",
      emoji: "✦",
      now: NOW
    });
    const duplicateTask = createTask({
      id: "task-1",
      title: "Existing target task",
      projectId: duplicateProject.id,
      now: NOW,
      orderIndex: 0
    });
    const incomingTask = createTask({
      id: "task-2",
      title: "Imported task",
      now: NOW,
      orderIndex: 1
    });

    await registry
      .repositoryFactory({ name: LEGACY_DATABASE_NAME })
      .projects.save(
        createProject({
          id: duplicateProject.id,
          name: "Legacy duplicate project",
          color: duplicateProject.color,
          emoji: duplicateProject.emoji,
          isFavorite: duplicateProject.isFavorite,
          deadline: duplicateProject.deadline,
          now: duplicateProject.createdAt
        })
      );
    await registry
      .repositoryFactory({ name: LEGACY_DATABASE_NAME })
      .tasks.save(
        createTask({
          ...duplicateTask,
          title: "Legacy duplicate task",
          now: duplicateTask.createdAt,
          orderIndex: duplicateTask.orderIndex
        })
      );
    await registry
      .repositoryFactory({ name: LEGACY_DATABASE_NAME })
      .tasks.save(incomingTask);

    const userRepository = registry.repositoryFactory({
      name: getUserDatabaseName(userId)
    });
    await userRepository.projects.save(duplicateProject);
    await userRepository.tasks.save(duplicateTask);

    await migrateLegacyAnonymousData(userId, {
      repositoryFactory: registry.repositoryFactory
    });

    await expect(userRepository.projects.listAll()).resolves.toEqual([duplicateProject]);
    await expect(userRepository.tasks.listAll()).resolves.toEqual([
      duplicateTask,
      incomingTask
    ]);
  });
});
