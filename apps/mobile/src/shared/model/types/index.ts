import type { Project, Task, TodayTaskGroup } from '@mindflow/domain';
import type { AppLanguage } from '@mindflow/copy';

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
  isTaskCreateOpen: boolean;
  taskCreatePreferredDate: string | null;
  isProjectCreateOpen: boolean;
  language: AppLanguage;
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
  }) => Promise<boolean>;
  toggleTask: (taskId: string) => Promise<void>;
  saveTaskEdit: (input: {
    taskId: string;
    title?: string;
    description?: string | null;
    dueDate?: string | null;
    priority?: Task['priority'];
    status?: Task['status'];
    projectId?: string | null;
  }, options?: { closeOnSuccess?: boolean; toastOnSuccess?: boolean }) => Promise<boolean>;
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
  }, options?: { closeOnSuccess?: boolean; toastOnSuccess?: boolean }) => Promise<boolean>;
  reorderProjectTasks: (
    projectId: string,
    orderedTaskIds: string[],
  ) => Promise<void>;
  openTaskEdit: (taskId: string) => void;
  closeTaskEdit: () => void;
  openProjectEdit: (projectId: string) => void;
  closeProjectEdit: () => void;
  openTaskCreate: (preferredDate?: string | null) => void;
  closeTaskCreate: () => void;
  createTask: (input: {
    title: string;
    dueDate?: string | null;
    priority?: Task['priority'];
    projectId?: string | null;
  }) => Promise<void>;
  openProjectCreate: () => void;
  closeProjectCreate: () => void;
  createProjectFromSheet: (input: {
    name: string;
    color: string;
    deadline?: string | null;
    isFavorite?: boolean;
  }) => Promise<void>;
  dismissToast: () => void;
  clearError: () => void;
  reload: () => Promise<void>;
  setLanguage: (lang: AppLanguage) => void;
  restoreTask: (taskId: string) => Promise<void>;
  restoreProject: (projectId: string) => Promise<void>;
}

export interface AppStore {
  state: AppState;
  derived: AppDerived;
  actions: AppActions;
}
