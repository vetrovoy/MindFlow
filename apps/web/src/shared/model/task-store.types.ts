import type {
  Project,
  Task,
  TaskPriority,
  TodayTaskGroup,
  getProjectProgress
} from "@mindflow/domain";

export interface ToastState {
  title: string;
  description?: string;
}

export interface ProjectSection {
  project: Project;
  tasks: Task[];
  progress: ReturnType<typeof getProjectProgress>;
}

export interface SaveTaskEditInput {
  taskId: string;
  title: string;
  description: string | null;
  status: Task["status"];
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string | null;
}

export interface SaveProjectEditInput {
  projectId: string;
  name: string;
  color: string;
  isFavorite: boolean;
  deadline: string | null;
}

export interface SaveOptions {
  closeOnSuccess?: boolean;
  toastOnSuccess?: boolean;
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  isHydrated: boolean;
  isSaving: boolean;
  error: string | null;
  selectedInboxTaskIds: string[];
  editingTaskId: string | null;
  editingProjectId: string | null;
  toast: ToastState | null;
}

export interface AppDerivedState {
  inboxTasks: Task[];
  todayFeed: TodayTaskGroup[];
  favoriteProjects: Project[];
  regularProjects: Project[];
  projectSections: ProjectSection[];
  editingTask: Task | null;
  editingProject: Project | null;
}

export interface AppActions {
  addInboxTask: (input: {
    title: string;
    dueDate?: string | null;
    projectId?: string | null;
    priority?: TaskPriority;
    status?: Task["status"];
  }) => Promise<boolean>;
  toggleTask: (taskId: string) => Promise<void>;
  openTaskEdit: (taskId: string) => void;
  closeTaskEdit: () => void;
  openProjectEdit: (projectId: string) => void;
  closeProjectEdit: () => void;
  saveTaskEdit: (
    input: SaveTaskEditInput,
    options?: SaveOptions
  ) => Promise<boolean>;
  saveProjectEdit: (
    input: SaveProjectEditInput,
    options?: SaveOptions
  ) => Promise<boolean>;
  archiveTask: (taskId: string) => Promise<void>;
  archiveProject: (projectId: string) => Promise<void>;
  restoreTask: (taskId: string) => Promise<void>;
  restoreProject: (projectId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleInboxSelection: (taskId: string) => void;
  clearInboxSelection: () => void;
  moveSelectedInboxTasks: (input: {
    projectId?: string;
    projectName?: string;
  }) => Promise<boolean>;
  reorderProjectTasks: (
    projectId: string,
    orderedTaskIds: string[]
  ) => Promise<boolean>;
  createProject: (input: {
    name: string;
    deadline?: string | null;
    color?: string;
  }) => Promise<boolean>;
  dismissToast: () => void;
  clearError: () => void;
  reload: () => Promise<void>;
}

export interface AppStore {
  state: AppState;
  derived: AppDerivedState;
  actions: AppActions;
}
