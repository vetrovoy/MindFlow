import { createDexieRepositoryBundle } from "@mindflow/data";

import {
  LEGACY_MINDFLOW_DATABASE_NAME,
  getMindFlowDatabaseName
} from "@/shared/model/mindflow-store.config";

export async function migrateLegacyAnonymousData(userId: string) {
  const legacyRepository = createDexieRepositoryBundle({
    name: LEGACY_MINDFLOW_DATABASE_NAME
  });
  const userRepository = createDexieRepositoryBundle({
    name: getMindFlowDatabaseName(userId)
  });
  const [legacyTasks, legacyProjects, userTasks, userProjects] = await Promise.all([
    legacyRepository.tasks.listAll(),
    legacyRepository.projects.listAll(),
    userRepository.tasks.listAll(),
    userRepository.projects.listAll()
  ]);

  if (legacyTasks.length === 0 && legacyProjects.length === 0) {
    return;
  }

  const userTaskIds = new Set(userTasks.map((task) => task.id));
  const userProjectIds = new Set(userProjects.map((project) => project.id));
  const tasksToImport = legacyTasks.filter((task) => !userTaskIds.has(task.id));
  const projectsToImport = legacyProjects.filter((project) => !userProjectIds.has(project.id));

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
