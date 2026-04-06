import React from 'react';

import type { AppStore } from '@shared/model/types';
import { fireEvent, render, screen } from '@mobile/test-utils';
import { InboxPage } from '.';

const mockUseMobileAppStore = jest.fn();

jest.mock('@shared/model/app-store-provider', () => ({
  useMobileAppStore: (selector: (store: AppStore) => unknown) =>
    mockUseMobileAppStore(selector),
}));

const baseStore: AppStore = {
  state: {
    tasks: [],
    projects: [],
    isHydrated: true,
    isSaving: false,
    error: null,
    editingTaskId: null,
    editingProjectId: null,
    isTaskCreateOpen: false,
    taskCreatePreferredDate: null,
    language: 'ru',
    isProjectCreateOpen: false,
  },
  derived: {
    inboxTasks: [],
    todayFeed: [],
    favoriteProjects: [],
    regularProjects: [],
    projectSections: [],
    editingTask: null,
    editingProject: null,
  },
  actions: {
    addInboxTask: jest.fn(),
    toggleTask: jest.fn(),
    saveTaskEdit: jest.fn(),
    createProject: jest.fn(),
    saveProjectEdit: jest.fn(),
    reorderProjectTasks: jest.fn(),
    openTaskEdit: jest.fn(),
    closeTaskEdit: jest.fn(),
    openProjectEdit: jest.fn(),
    closeProjectEdit: jest.fn(),
    openTaskCreate: jest.fn(),
    closeTaskCreate: jest.fn(),
    createTask: jest.fn(),
    openProjectCreate: jest.fn(),
    closeProjectCreate: jest.fn(),
    createProjectFromSheet: jest.fn(),
    dismissToast: jest.fn(),
    clearError: jest.fn(),
    reload: jest.fn(),
    setLanguage: jest.fn(),
    restoreTask: jest.fn(),
    restoreProject: jest.fn(),
  },
};

function renderWithStore(partialStore?: {
  state?: Partial<AppStore['state']>;
  derived?: Partial<AppStore['derived']>;
  actions?: Partial<AppStore['actions']>;
}) {
  const store: AppStore = {
    ...baseStore,
    ...partialStore,
    state: { ...baseStore.state, ...partialStore?.state },
    derived: { ...baseStore.derived, ...partialStore?.derived },
    actions: { ...baseStore.actions, ...partialStore?.actions },
  };

  mockUseMobileAppStore.mockImplementation(selector => selector(store));

  return render(<InboxPage />);
}

describe('InboxPage', () => {
  beforeEach(() => {
    mockUseMobileAppStore.mockReset();
    jest.clearAllMocks();
  });

  it('renders empty state when inbox has no tasks', () => {
    renderWithStore();

    expect(screen.getByText('Пусто')).toBeTruthy();
    expect(
      screen.getByText(
        'Добавьте задачу через быстрое поле, и она появится здесь.',
      ),
    ).toBeTruthy();
  });

  it('renders completed tasks through a collapsible section', () => {
    renderWithStore({
      derived: {
        inboxTasks: [
          {
            id: 'task-1',
            title: 'Активная задача',
            description: null,
            status: 'todo',
            priority: 'high',
            dueDate: null,
            projectId: null,
            orderIndex: 0,
            createdAt: '2026-04-01T09:00:00.000Z',
            updatedAt: '2026-04-01T09:00:00.000Z',
            completedAt: null,
            archivedAt: null,
          },
          {
            id: 'task-2',
            title: 'Завершённая задача',
            description: null,
            status: 'done',
            priority: 'low',
            dueDate: null,
            projectId: null,
            orderIndex: 1,
            createdAt: '2026-04-01T10:00:00.000Z',
            updatedAt: '2026-04-01T10:00:00.000Z',
            completedAt: '2026-04-01T12:00:00.000Z',
            archivedAt: null,
          },
        ],
        todayFeed: [
          {
            bucket: 'due-today',
            task: {
              id: 'task-1',
              title: 'Активная задача',
              description: null,
              status: 'todo',
              priority: 'high',
              dueDate: new Date().toISOString().slice(0, 10),
              projectId: null,
              orderIndex: 0,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
        ],
      },
    });

    expect(screen.getByText('Выполненные')).toBeTruthy();
    expect(screen.getByText('Активная задача')).toBeTruthy();
    expect(screen.getByText('СЕГОДНЯ')).toBeTruthy();
    expect(screen.queryByText('Завершённая задача')).toBeNull();

    fireEvent.press(screen.getByText('Выполненные'));

    expect(screen.getByText('Завершённая задача')).toBeTruthy();
  });

  it('opens completed section by default when there are no active tasks', () => {
    renderWithStore({
      derived: {
        inboxTasks: [
          {
            id: 'task-2',
            title: 'Только завершённая задача',
            description: null,
            status: 'done',
            priority: 'low',
            dueDate: null,
            projectId: null,
            orderIndex: 1,
            createdAt: '2026-04-01T10:00:00.000Z',
            updatedAt: '2026-04-01T10:00:00.000Z',
            completedAt: '2026-04-01T12:00:00.000Z',
            archivedAt: null,
          },
        ],
      },
    });

    expect(screen.getByText('Только завершённая задача')).toBeTruthy();
  });

  it('removes legacy helper copy and active section header from inbox layout', () => {
    renderWithStore({
      derived: {
        inboxTasks: [
          {
            id: 'task-1',
            title: 'Активная задача',
            description: null,
            status: 'todo',
            priority: 'high',
            dueDate: null,
            projectId: null,
            orderIndex: 0,
            createdAt: '2026-04-01T09:00:00.000Z',
            updatedAt: '2026-04-01T09:00:00.000Z',
            completedAt: null,
            archivedAt: null,
          },
        ],
      },
    });

    expect(
      screen.queryByText(
        'Активные задачи сверху, выполненные ниже. Быстрый захват остаётся в контексте Inbox.',
      ),
    ).toBeNull();
    expect(
      screen.queryByText(
        'Тап по задаче открывает task-edit modal, а чекбокс обновляет статус через store action.',
      ),
    ).toBeNull();
    expect(screen.queryByText('Активные')).toBeNull();
  });

  it('does not render date badge for completed task', () => {
    renderWithStore({
      derived: {
        inboxTasks: [
          {
            id: 'task-1',
            title: 'Done today task',
            description: null,
            status: 'done',
            priority: 'medium',
            dueDate: new Date().toISOString().slice(0, 10),
            projectId: null,
            orderIndex: 0,
            createdAt: '2026-04-01T09:00:00.000Z',
            updatedAt: '2026-04-01T09:00:00.000Z',
            completedAt: '2026-04-01T12:00:00.000Z',
            archivedAt: null,
          },
        ],
      },
    });

    expect(screen.queryByText('СЕГОДНЯ')).toBeNull();
    expect(screen.queryByText('ПРОСРОЧЕНО')).toBeNull();
  });

  it('uses todayFeed as badge source instead of local due date checks', () => {
    renderWithStore({
      derived: {
        inboxTasks: [
          {
            id: 'task-1',
            title: 'Due today but not in today feed',
            description: null,
            status: 'todo',
            priority: 'medium',
            dueDate: new Date().toISOString().slice(0, 10),
            projectId: null,
            orderIndex: 0,
            createdAt: '2026-04-01T09:00:00.000Z',
            updatedAt: '2026-04-01T09:00:00.000Z',
            completedAt: null,
            archivedAt: null,
          },
        ],
        todayFeed: [],
      },
    });

    expect(screen.queryByText('СЕГОДНЯ')).toBeNull();
    expect(screen.queryByText('ПРОСРОЧЕНО')).toBeNull();
  });

  it('renders inbox rows without legacy status text noise', () => {
    renderWithStore({
      derived: {
        inboxTasks: [
          {
            id: 'task-1',
            title: 'Compact inbox row',
            description: null,
            status: 'todo',
            priority: 'high',
            dueDate: null,
            projectId: null,
            orderIndex: 0,
            createdAt: '2026-04-01T09:00:00.000Z',
            updatedAt: '2026-04-01T09:00:00.000Z',
            completedAt: null,
            archivedAt: null,
          },
        ],
      },
    });

    expect(screen.queryByText('В работе')).toBeNull();
    expect(screen.queryByText('Готово')).toBeNull();
    expect(screen.getByText('Высокий')).toBeTruthy();
  });
});
