import React from 'react';

import type { AppStore } from '@shared/model/types';
import { act, fireEvent, render, screen } from '@mobile/test-utils';
import { InboxPage } from './inbox-page';

const mockUseMobileAppStore = jest.fn();

jest.mock('@shared/model/app-store-provider', () => ({
  useMobileAppStore: (selector: (store: AppStore) => unknown) => mockUseMobileAppStore(selector),
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
    toast: null,
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
    dismissToast: jest.fn(),
    clearError: jest.fn(),
    reload: jest.fn(),
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
    expect(screen.getByText('Добавьте задачу через быстрое поле, и она появится здесь.')).toBeTruthy();
  });

  it('submits quick capture into addInboxTask', async () => {
    const addInboxTask = jest.fn().mockResolvedValue(true);
    renderWithStore({ actions: { addInboxTask } });

    fireEvent.changeText(screen.getByPlaceholderText('Новая задача...'), 'Подготовить релиз');
    await act(async () => {
      fireEvent.press(screen.getByText('Сохранить'));
    });

    expect(addInboxTask).toHaveBeenCalledWith({ title: 'Подготовить релиз' });
    expect(screen.queryByDisplayValue('Подготовить релиз')).toBeNull();
  });

  it('keeps quick capture text when add fails', async () => {
    const addInboxTask = jest.fn().mockResolvedValue(false);
    renderWithStore({ actions: { addInboxTask } });

    fireEvent.changeText(screen.getByPlaceholderText('Новая задача...'), 'Оставить в поле');
    await act(async () => {
      fireEvent.press(screen.getByText('Сохранить'));
    });

    expect(screen.getByDisplayValue('Оставить в поле')).toBeTruthy();
  });

  it('renders active and completed sections', () => {
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
      },
    });

    expect(screen.getByText('Активные')).toBeTruthy();
    expect(screen.getByText('Выполненные')).toBeTruthy();
    expect(screen.getByText('Активная задача')).toBeTruthy();
    expect(screen.getByText('Завершённая задача')).toBeTruthy();
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

    expect(screen.queryByText('TODAY')).toBeNull();
    expect(screen.queryByText('OVERDUE')).toBeNull();
  });
});
