import React from 'react';

import type { AppStore } from '@shared/model/types';
import { fireEvent, render, screen } from '@mobile/test-utils';
import { TodayPage } from '.';

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
    archiveTask: jest.fn(),
    deleteTask: jest.fn(),
    archiveProject: jest.fn(),
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

  return render(<TodayPage />);
}

describe('TodayPage', () => {
  beforeEach(() => {
    mockUseMobileAppStore.mockReset();
    jest.clearAllMocks();
  });

  it('renders a single main content card with empty state', () => {
    renderWithStore();

    expect(screen.getByTestId('today-main-card')).toBeTruthy();
    expect(screen.getByText('Сегодня свободно')).toBeTruthy();
    expect(
      screen.getByText(
        'На сегодня сейчас нет задач. Важные входящие и задачи на сегодня появятся здесь автоматически.',
      ),
    ).toBeTruthy();
  });

  it('removes legacy subtitle and intro chrome', () => {
    renderWithStore();

    expect(
      screen.queryByText(
        'Смешанная лента для overdue и due-today задач с shared feedback-механикой.',
      ),
    ).toBeNull();
    expect(screen.queryByText('Фокус дня')).toBeNull();
    expect(
      screen.queryByText(
        'Bottom sheet ниже уже готов как контейнер для task-edit flow из следующих задач.',
      ),
    ).toBeNull();
    expect(screen.queryByText('Быстрый захват')).toBeNull();
  });

  it('renders today feed items inside the main card', () => {
    const toggleTask = jest.fn();
    const openTaskEdit = jest.fn();

    renderWithStore({
      actions: { toggleTask, openTaskEdit },
      derived: {
        todayFeed: [
          {
            bucket: 'overdue',
            task: {
              id: 'task-1',
              title: 'Просроченная задача',
              description: null,
              status: 'todo',
              priority: 'high',
              dueDate: '2026-04-02',
              projectId: null,
              orderIndex: 0,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
          {
            bucket: 'due-today',
            task: {
              id: 'task-2',
              title: 'Задача на сегодня',
              description: null,
              status: 'todo',
              priority: 'medium',
              dueDate: '2026-04-03',
              projectId: null,
              orderIndex: 1,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
          {
            bucket: 'high-priority-inbox',
            task: {
              id: 'task-3',
              title: 'High priority inbox task',
              description: null,
              status: 'todo',
              priority: 'high',
              dueDate: null,
              projectId: null,
              orderIndex: 2,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
        ],
      },
    });

    expect(screen.getByTestId('today-main-card')).toBeTruthy();
    expect(screen.getByText('Просроченная задача')).toBeTruthy();
    expect(screen.getByText('Задача на сегодня')).toBeTruthy();
    expect(screen.getByText('High priority inbox task')).toBeTruthy();
    expect(screen.getByText('Просрочено')).toBeTruthy();
    expect(screen.getAllByText('Сегодня')).toHaveLength(1);
    expect(screen.queryByText('Inbox / high')).toBeNull();

    fireEvent.press(screen.getAllByRole('checkbox')[0]);
    fireEvent.press(screen.getByText('Задача на сегодня'));

    expect(toggleTask).toHaveBeenCalledWith('task-1');
    expect(openTaskEdit).toHaveBeenCalledWith('task-2');
  });

  it('collapses overdue section independently from today section', () => {
    renderWithStore({
      derived: {
        todayFeed: [
          {
            bucket: 'overdue',
            task: {
              id: 'task-1',
              title: 'Просроченная задача',
              description: null,
              status: 'todo',
              priority: 'high',
              dueDate: '2026-04-02',
              projectId: null,
              orderIndex: 0,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
          {
            bucket: 'due-today',
            task: {
              id: 'task-2',
              title: 'Задача на сегодня',
              description: null,
              status: 'todo',
              priority: 'medium',
              dueDate: '2026-04-03',
              projectId: null,
              orderIndex: 1,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
        ],
      },
    });

    fireEvent.press(screen.getByText('Просрочено'));

    expect(screen.queryByText('Просроченная задача')).toBeNull();
    expect(screen.getByText('Задача на сегодня')).toBeTruthy();
  });

  it('renders today tasks without extra section wrapper when overdue is absent', () => {
    renderWithStore({
      derived: {
        todayFeed: [
          {
            bucket: 'due-today',
            task: {
              id: 'task-2',
              title: 'Задача на сегодня',
              description: null,
              status: 'todo',
              priority: 'medium',
              dueDate: '2026-04-03',
              projectId: null,
              orderIndex: 1,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
          {
            bucket: 'high-priority-inbox',
            task: {
              id: 'task-3',
              title: 'Inbox without overdue',
              description: null,
              status: 'todo',
              priority: 'high',
              dueDate: null,
              projectId: null,
              orderIndex: 2,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
              completedAt: null,
              archivedAt: null,
            },
          },
        ],
      },
    });

    expect(screen.queryByText('Просрочено')).toBeNull();
    expect(screen.queryByText('Сегодня')).toBeNull();
    expect(screen.getByText('Задача на сегодня')).toBeTruthy();
    expect(screen.getByText('Inbox without overdue')).toBeTruthy();
    expect(screen.queryByText('Inbox / high')).toBeNull();
  });
});
