import { createStore } from 'zustand/vanilla';

import { createInMemoryRepositoryBundle } from '@mindflow/data';
import type { RepositoryBundle } from '@mindflow/data';

import { computeDerived, INITIAL_STATE } from './selectors';
import { createAppActions } from './actions';
import type { AppState, AppStore } from './types';

async function readSnapshot(repository: RepositoryBundle) {
  const [tasks, projects] = await Promise.all([
    repository.tasks.listAll(),
    repository.projects.listAll(),
  ]);
  return { tasks, projects };
}

function createTestStore() {
  const repository = createInMemoryRepositoryBundle();
  const initialState: AppState = { ...INITIAL_STATE };

  const store = createStore<AppStore>((set, get) => {
    const patchState = (patch: Partial<AppState>) => {
      set(store => {
        const nextState = { ...store.state, ...patch };
        return { state: nextState, derived: computeDerived(nextState) };
      });
    };

    const applySnapshot = async () => {
      const snapshot = await readSnapshot(repository);
      patchState({
        tasks: snapshot.tasks,
        projects: snapshot.projects,
        isHydrated: true,
      });
    };

    const runMutation = async (work: () => Promise<void>): Promise<boolean> => {
      patchState({ isSaving: true, error: null });
      try {
        await repository.transaction.run(work);
        await applySnapshot();
        return true;
      } catch {
        patchState({ error: 'Mutation failed' });
        return false;
      } finally {
        patchState({ isSaving: false });
      }
    };

    return {
      state: initialState,
      derived: computeDerived(initialState),
      actions: createAppActions({
        repository,
        getStore: get,
        patchState,
        runMutation,
        applySnapshot,
      }),
    };
  });

  return { store: store.getState(), repository };
}

describe('mobile store integration', () => {
  let testStore: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    testStore = createTestStore();
  });

  it('creates a task and reads it back from the repository', async () => {
    const { store, repository } = testStore;

    await store.actions.addInboxTask({ title: 'Test task' });

    const tasks = await repository.tasks.listAll();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Test task');
    expect(tasks[0].projectId).toBeNull();
  });

  it('toggles a task done', async () => {
    const { store, repository } = testStore;

    await store.actions.addInboxTask({ title: 'Toggle me' });
    const tasks = await repository.tasks.listAll();
    const taskId = tasks[0].id;

    expect(tasks[0].status).toBe('todo');
    await store.actions.toggleTask(taskId);

    const updated = await repository.tasks.getById(taskId);
    expect(updated?.status).toBe('done');
  });

  it('creates a project and updates it', async () => {
    const { store, repository } = testStore;

    await store.actions.createProject({
      name: 'Test project',
      color: '#FF0000',
      emoji: '🧪',
    });

    const projects = await repository.projects.listAll();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Test project');

    await store.actions.saveProjectEdit({
      projectId: projects[0].id,
      name: 'Updated project',
      color: '#00FF00',
      emoji: '🔬',
    });

    const updated = await repository.projects.getById(projects[0].id);
    expect(updated?.name).toBe('Updated project');
    expect(updated?.color).toBe('#00FF00');
  });

  it('archives and restores a task', async () => {
    const { store, repository } = testStore;

    await store.actions.addInboxTask({ title: 'Archive me' });
    const tasks = await repository.tasks.listAll();
    const taskId = tasks[0].id;

    await store.actions.archiveTask(taskId);
    let task = await repository.tasks.getById(taskId);
    expect(task?.archivedAt).not.toBeNull();

    await store.actions.restoreTask(taskId);
    task = await repository.tasks.getById(taskId);
    expect(task?.archivedAt).toBeNull();
  });

  it('archives and restores a project', async () => {
    const { store, repository } = testStore;

    await store.actions.createProject({
      name: 'Archive project',
      color: '#0000FF',
      emoji: '📦',
    });
    const projects = await repository.projects.listAll();
    const projectId = projects[0].id;

    await store.actions.archiveProject(projectId);
    let project = await repository.projects.getById(projectId);
    expect(project?.archivedAt).not.toBeNull();

    await store.actions.restoreProject(projectId);
    project = await repository.projects.getById(projectId);
    expect(project?.archivedAt).toBeNull();
  });

  it('deletes a task', async () => {
    const { store, repository } = testStore;

    await store.actions.addInboxTask({ title: 'Delete me' });
    const tasks = await repository.tasks.listAll();
    const taskId = tasks[0].id;

    await store.actions.deleteTask(taskId);
    const deleted = await repository.tasks.getById(taskId);
    expect(deleted).toBeNull();
  });
});
