import { createDexieRepositoryBundle } from "@mindflow/data";

import {
  LEGACY_DATABASE_NAME,
  getLegacyUserDatabaseName,
  getUserDatabaseName
} from "@/shared/model/app-storage.config";

export async function migrateLegacyAnonymousData(userId: string) {
  const legacyRepository = createDexieRepositoryBundle({
    name: LEGACY_DATABASE_NAME
  });
  const userRepository = createDexieRepositoryBundle({
    name: getUserDatabaseName(userId)
  });
  const legacyUserRepository = createDexieRepositoryBundle({
    name: getLegacyUserDatabaseName(userId)
  });
  const [legacyTasks, legacyProjects, legacyUserTasks, legacyUserProjects, userTasks, userProjects] = await Promise.all([
    legacyRepository.tasks.listAll(),
    legacyRepository.projects.listAll(),
    legacyUserRepository.tasks.listAll(),
    legacyUserRepository.projects.listAll(),
    userRepository.tasks.listAll(),
    userRepository.projects.listAll()
  ]);
  const mergedLegacyTasks = [...legacyTasks, ...legacyUserTasks];
  const mergedLegacyProjects = [...legacyProjects, ...legacyUserProjects];

  if (mergedLegacyTasks.length === 0 && mergedLegacyProjects.length === 0) {
    return;
  }

  const userTaskIds = new Set(userTasks.map((task) => task.id));
  const userProjectIds = new Set(userProjects.map((project) => project.id));
  const tasksToImport = mergedLegacyTasks.filter((task) => !userTaskIds.has(task.id));
  const projectsToImport = mergedLegacyProjects.filter((project) => !userProjectIds.has(project.id));

  if (tasksToImport.length === 0 && projectsToImport.length === 0) {
    return;
  }

  await userRepository.transaction.run(async () => {
    if (projectsToImport.length > 0) {
      await userRepository.projects.saveMany(projectsToImport);
    }

    if (tasksToImport.length > 0) {
      await userRepository.tasks.saveMany(tasksToImport);
    }
  });
}
