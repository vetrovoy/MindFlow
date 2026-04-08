import type { RepositoryBundle } from "../contracts";
import { ApiTaskRepository } from "./api-task-repository";
import { ApiProjectRepository } from "./api-project-repository";
import { ApiTransaction } from "./api-transaction";
import { ApiSyncPort } from "./api-sync-port";

export interface ApiRepositoryBundleOptions {
  baseUrl: string;
  token: string;
}

export function createApiRepositoryBundle(
  options: ApiRepositoryBundleOptions
): RepositoryBundle {
  const { baseUrl, token } = options;

  const tasks = new ApiTaskRepository(baseUrl, token);
  const projects = new ApiProjectRepository(baseUrl, token);
  const transaction = new ApiTransaction();
  const sync = new ApiSyncPort(baseUrl, token);

  return { tasks, projects, transaction, sync };
}

export { ApiTaskRepository } from "./api-task-repository";
export { ApiProjectRepository } from "./api-project-repository";
export { ApiTransaction } from "./api-transaction";
export { ApiSyncPort } from "./api-sync-port";
