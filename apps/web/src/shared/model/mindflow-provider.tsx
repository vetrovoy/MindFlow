import {
  archiveTask,
  buildTodayFeed,
  bulkMoveToProject,
  createProject,
  createTask,
  getProjectProgress,
  reorderTasks,
  setTaskStatus,
  toggleTaskDone,
  updateTask,
  validateProject,
  validateTask,
  type Project,
  type Task,
  type TaskPriority,
  type TodayTaskGroup
} from "@mindflow/domain";
import { createDexieRepositoryBundle, type RepositoryBundle } from "@mindflow/data";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import { getNowIso, getTodayDateKey } from "../lib/date";
import { createId } from "../lib/ids";
import { getProjectDecoration } from "../lib/projects";

interface ToastState {
  title: string;
  description?: string;
}

interface ProjectSection {
  project: Project;
  tasks: Task[];
  progress: ReturnType<typeof getProjectProgress>;
}

interface SaveTaskEditInput {
  taskId: string;
  title: string;
  description: string | null;
  status: Task["status"];
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
}

interface MindFlowContextValue {
  state: {
    tasks: Task[];
    projects: Project[];
    isHydrated: boolean;
    isSaving: boolean;
    error: string | null;
    selectedInboxTaskIds: string[];
    editingTaskId: string | null;
    editingProjectId: string | null;
    toast: ToastState | null;
  };
  derived: {
    inboxTasks: Task[];
    todayFeed: TodayTaskGroup[];
    favoriteProjects: Project[];
    regularProjects: Project[];
    projectSections: ProjectSection[];
    editingTask: Task | null;
    editingProject: Project | null;
  };
  actions: {
    addInboxTask: (title: string) => Promise<boolean>;
    toggleTask: (taskId: string) => Promise<void>;
    openTaskEdit: (taskId: string) => void;
    closeTaskEdit: () => void;
    openProjectEdit: (projectId: string) => void;
    closeProjectEdit: () => void;
    saveTaskEdit: (input: SaveTaskEditInput) => Promise<boolean>;
    archiveTask: (taskId: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    toggleInboxSelection: (taskId: string) => void;
    clearInboxSelection: () => void;
    moveSelectedInboxTasks: (input: {
      projectId?: string;
      projectName?: string;
    }) => Promise<boolean>;
    reorderProjectTasks: (projectId: string, orderedTaskIds: string[]) => Promise<boolean>;
    createProject: (name: string) => Promise<boolean>;
    dismissToast: () => void;
    clearError: () => void;
    reload: () => Promise<void>;
  };
}

const MindFlowContext = createContext<MindFlowContextValue | null>(null);

function sortProjects(projects: Project[]) {
  return [...projects].sort((left, right) => {
    if (left.isFavorite !== right.isFavorite) {
      return left.isFavorite ? -1 : 1;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "todo" ? -1 : 1;
    }

    const orderResult = left.orderIndex - right.orderIndex;
    if (orderResult !== 0) {
      return orderResult;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
}

function getVisibleTasks(tasks: Task[], projects: Project[]) {
  const archivedProjectIds = new Set(
    projects.filter((project) => project.archivedAt != null).map((project) => project.id)
  );

  return tasks.filter((task) => {
    if (task.archivedAt != null) {
      return false;
    }

    return task.projectId == null || !archivedProjectIds.has(task.projectId);
  });
}

function getNextOrderIndex(
  tasks: Task[],
  projectId: string | null,
  excludingTaskId?: string
) {
  const matching = tasks.filter(
    (task) => task.projectId === projectId && task.id !== excludingTaskId && task.archivedAt == null
  );

  if (matching.length === 0) {
    return 0;
  }

  return Math.max(...matching.map((task) => task.orderIndex)) + 1;
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Непредвиденная ошибка в локальных данных";
}

async function readSnapshot(repository: RepositoryBundle) {
  const [tasks, projects] = await Promise.all([
    repository.tasks.listAll(),
    repository.projects.listAll()
  ]);

  return { tasks, projects };
}

export function MindFlowProvider({ children }: PropsWithChildren) {
  const repository = useMemo(
    () => createDexieRepositoryBundle({ name: "mindflow-web" }),
    []
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInboxTaskIds, setSelectedInboxTaskIds] = useState<string[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const applySnapshot = async () => {
    const snapshot = await readSnapshot(repository);
    const visibleInboxIds = new Set(
      sortTasks(getVisibleTasks(snapshot.tasks, snapshot.projects).filter((task) => task.projectId == null))
        .map((task) => task.id)
    );

    startTransition(() => {
      setTasks(snapshot.tasks);
      setProjects(snapshot.projects);
      setSelectedInboxTaskIds((current) =>
        current.filter((taskId) => visibleInboxIds.has(taskId))
      );
      setEditingTaskId((current) => {
        if (current == null) {
          return null;
        }

        return snapshot.tasks.some((task) => task.id === current) ? current : null;
      });
      setEditingProjectId((current) => {
        if (current == null) {
          return null;
        }

        return snapshot.projects.some((project) => project.id === current) ? current : null;
      });
      setIsHydrated(true);
    });
  };

  async function reload() {
    try {
      await applySnapshot();
    } catch (nextError) {
      setError(formatError(nextError));
      setIsHydrated(true);
    }
  }

  async function runMutation(work: () => Promise<void>) {
    setIsSaving(true);
    setError(null);

    try {
      await repository.transaction.run(work);
      await applySnapshot();
      return true;
    } catch (nextError) {
      setError(formatError(nextError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    if (toast == null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 2600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  const visibleTasks = useMemo(() => getVisibleTasks(tasks, projects), [projects, tasks]);
  const activeProjects = useMemo(
    () => sortProjects(projects.filter((project) => project.archivedAt == null)),
    [projects]
  );
  const inboxTasks = useMemo(
    () => sortTasks(visibleTasks.filter((task) => task.projectId == null)),
    [visibleTasks]
  );
  const todayFeed = useMemo(
    () => buildTodayFeed(visibleTasks, getTodayDateKey()),
    [visibleTasks]
  );
  const projectSections = useMemo<ProjectSection[]>(
    () =>
      activeProjects.map((project) => ({
        project,
        tasks: sortTasks(visibleTasks.filter((task) => task.projectId === project.id)),
        progress: getProjectProgress(visibleTasks, project.id)
      })),
    [activeProjects, visibleTasks]
  );
  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId) ?? null,
    [editingTaskId, tasks]
  );
  const favoriteProjects = useMemo(
    () => activeProjects.filter((project) => project.isFavorite),
    [activeProjects]
  );
  const regularProjects = useMemo(
    () => activeProjects.filter((project) => !project.isFavorite),
    [activeProjects]
  );
  const editingProject = useMemo(
    () => projects.find((project) => project.id === editingProjectId) ?? null,
    [editingProjectId, projects]
  );

  async function addInboxTask(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return false;
    }

    const now = getNowIso();
    const nextTask = createTask({
      id: createId(),
      title: trimmedTitle,
      now,
      orderIndex: getNextOrderIndex(tasks, null)
    });

    const saved = await runMutation(async () => {
      await repository.tasks.save(nextTask);
    });

    if (saved) {
      setToast({
        title: "Задача добавлена",
        description: "Новая задача уже ждёт во Входящих."
      });
    }

    return saved;
  }

  async function toggleTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (task == null) {
      return;
    }

    await runMutation(async () => {
      await repository.tasks.save(toggleTaskDone(task, getNowIso()));
    });
  }

  async function saveTaskEdit(input: SaveTaskEditInput) {
    const task = tasks.find((item) => item.id === input.taskId);
    if (task == null) {
      return false;
    }

    const nextProjectId = input.projectId;
    const now = getNowIso();
    let nextTask = updateTask(
      task,
      {
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate,
        projectId: nextProjectId
      },
      now
    );

    if (task.projectId !== nextProjectId) {
      nextTask = validateTask({
        ...nextTask,
        orderIndex: getNextOrderIndex(tasks, nextProjectId, task.id)
      });
    }

    if (nextTask.status !== input.status) {
      nextTask = setTaskStatus(nextTask, input.status, now);
    }

    const saved = await runMutation(async () => {
      await repository.tasks.save(nextTask);
    });

    if (saved) {
      setEditingTaskId(null);
      setToast({
        title: "Задача обновлена",
        description: "Изменения сохранены локально."
      });
    }

    return saved;
  }

  async function archiveTaskById(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (task == null) {
      return;
    }

    const saved = await runMutation(async () => {
      await repository.tasks.save(archiveTask(task, getNowIso()));
    });

    if (saved) {
      setEditingTaskId(null);
      setToast({
        title: "Задача архивирована",
        description: "Она скрыта из активных экранов."
      });
    }
  }

  async function deleteTaskById(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (task == null) {
      return;
    }

    const saved = await runMutation(async () => {
      await repository.tasks.delete(taskId);
    });

    if (saved) {
      setEditingTaskId(null);
      setToast({
        title: "Задача удалена",
        description: "Мы убрали её из локального плана."
      });
    }
  }

  function toggleInboxSelection(taskId: string) {
    setSelectedInboxTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((currentTaskId) => currentTaskId !== taskId)
        : [...current, taskId]
    );
  }

  async function createProjectFromName(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }

    const now = getNowIso();
    const decoration = getProjectDecoration(projects.length);
    const nextProject = createProject({
      id: createId(),
      name: trimmedName,
      color: decoration.color,
      emoji: decoration.emoji,
      now
    });

    const saved = await runMutation(async () => {
      await repository.projects.save(nextProject);
    });

    if (saved) {
      setToast({
        title: "Список создан",
        description: "Теперь в него можно переносить задачи из Входящих."
      });
    }

    return saved;
  }

  async function moveSelectedInboxTasks(input: {
    projectId?: string;
    projectName?: string;
  }) {
    const orderedSelection = inboxTasks
      .filter((task) => selectedInboxTaskIds.includes(task.id))
      .map((task) => task.id);

    if (orderedSelection.length === 0) {
      return false;
    }

    let targetProjectId = input.projectId?.trim() || undefined;
    const now = getNowIso();
    let nextProject: Project | null = null;

    if (targetProjectId == null) {
      const trimmedName = input.projectName?.trim();
      if (!trimmedName) {
        return false;
      }

      const decoration = getProjectDecoration(projects.length);
      nextProject = createProject({
        id: createId(),
        name: trimmedName,
        color: decoration.color,
        emoji: decoration.emoji,
        now
      });
      targetProjectId = nextProject.id;
    }

    const selectedTasks = tasks.filter((task) => orderedSelection.includes(task.id));
    const movedTasks = bulkMoveToProject(selectedTasks, orderedSelection, targetProjectId, now);

    const saved = await runMutation(async () => {
      if (nextProject != null) {
        await repository.projects.save(validateProject(nextProject));
      }

      await repository.tasks.saveMany(movedTasks);
    });

    if (saved) {
      setSelectedInboxTaskIds([]);
      setToast({
        title: "Задачи перенесены",
        description:
          nextProject == null
            ? "Выбранные задачи перенесены в нужный список."
            : "Новый список создан и сразу заполнен задачами из Входящих."
      });
    }

    return saved;
  }

  async function reorderProjectTasksById(projectId: string, orderedTaskIds: string[]) {
    const projectTasks = tasks.filter(
      (task) => task.projectId === projectId && task.archivedAt == null
    );

    if (projectTasks.length <= 1) {
      return false;
    }

    const reorderedTasks = reorderTasks(projectTasks, orderedTaskIds, getNowIso());
    const saved = await runMutation(async () => {
      await repository.tasks.saveMany(reorderedTasks);
    });

    if (saved) {
      setToast({
        title: "Порядок обновлён",
        description: "Ручная сортировка теперь отражает реальную последовательность работы."
      });
    }

    return saved;
  }

  const value: MindFlowContextValue = {
    state: {
      tasks,
      projects,
      isHydrated,
      isSaving,
      error,
      selectedInboxTaskIds,
      editingTaskId,
      editingProjectId,
      toast
    },
    derived: {
      inboxTasks,
      todayFeed,
      favoriteProjects,
      regularProjects,
      projectSections,
      editingTask,
      editingProject
    },
    actions: {
      addInboxTask,
      toggleTask,
      openTaskEdit: setEditingTaskId,
      closeTaskEdit: () => {
        setEditingTaskId(null);
      },
      openProjectEdit: setEditingProjectId,
      closeProjectEdit: () => {
        setEditingProjectId(null);
      },
      saveTaskEdit,
      archiveTask: archiveTaskById,
      deleteTask: deleteTaskById,
      toggleInboxSelection,
      clearInboxSelection: () => {
        setSelectedInboxTaskIds([]);
      },
      moveSelectedInboxTasks,
      reorderProjectTasks: reorderProjectTasksById,
      createProject: createProjectFromName,
      dismissToast: () => {
        setToast(null);
      },
      clearError: () => {
        setError(null);
      },
      reload
    }
  };

  return <MindFlowContext.Provider value={value}>{children}</MindFlowContext.Provider>;
}

export function useMindFlowApp() {
  const value = useContext(MindFlowContext);

  if (value == null) {
    throw new Error("useMindFlowApp must be used inside MindFlowProvider");
  }

  return value;
}
