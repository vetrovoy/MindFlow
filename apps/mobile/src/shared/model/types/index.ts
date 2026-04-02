import type { Project, Task, TodayTaskGroup } from '@mindflow/domain';

export interface ToastState {
  message: string;
  variant: 'success' | 'error' | 'info';
}

export interface ProjectSection {
  project: Project;
  tasks: Task[];
  progress: { done: number; total: number; ratio: number };
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  isHydrated: boolean;
  isSaving: boolean;
  error: string | null;
  editingTaskId: string | null;
  editingProjectId: string | null;
  toast: ToastState | null;
}

export interface AppDerived {
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
  }) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  saveTaskEdit: (input: {
    taskId: string;
    title?: string;
    description?: string | null;
    dueDate?: string | null;
    priority?: Task['priority'];
    status?: Task['status'];
    projectId?: string | null;
  }) => Promise<void>;
  createProject: (input: {
    name: string;
    color: string;
    emoji: string;
    deadline?: string | null;
    isFavorite?: boolean;
  }) => Promise<void>;
  saveProjectEdit: (input: {
    projectId: string;
    name?: string;
    color?: string;
    emoji?: string;
    deadline?: string | null;
    isFavorite?: boolean;
  }) => Promise<void>;
  reorderProjectTasks: (
    projectId: string,
    orderedTaskIds: string[],
  ) => Promise<void>;
  openTaskEdit: (taskId: string) => void;
  closeTaskEdit: () => void;
  openProjectEdit: (projectId: string) => void;
  closeProjectEdit: () => void;
  dismissToast: () => void;
  clearError: () => void;
  reload: () => Promise<void>;
}

export interface AppStore {
  state: AppState;
  derived: AppDerived;
  actions: AppActions;
}
