import React from 'react';

import type { AppStore } from '@shared/model/types';
import { act, fireEvent, render, screen } from '@mobile/test-utils';
import { TaskQuickAddFeature as QuickAddFeature } from './index';

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
    isTaskCreateOpen: false,
    taskCreatePreferredDate: null,
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
  },
};

function renderWithStore(
  props: { preferredDate?: string | null },
  partialStore?: Partial<AppStore['actions']>,
) {
  const store: AppStore = {
    ...baseStore,
    actions: { ...baseStore.actions, ...partialStore },
  };
  mockUseMobileAppStore.mockImplementation(selector => selector(store));
  return render(<QuickAddFeature {...props} />);
}

describe('QuickAddFeature', () => {
  beforeEach(() => {
    mockUseMobileAppStore.mockReset();
    jest.clearAllMocks();
  });

  it('submits task title and clears field on success', async () => {
    const addInboxTask = jest.fn().mockResolvedValue(true);
    renderWithStore({}, { addInboxTask });

    fireEvent.changeText(screen.getByPlaceholderText('Новая задача...'), 'Подготовить релиз');
    await act(async () => {
      fireEvent.press(screen.getByTestId('quick-add-submit'));
    });

    expect(addInboxTask).toHaveBeenCalledWith({ title: 'Подготовить релиз', dueDate: null });
    expect(screen.queryByDisplayValue('Подготовить релиз')).toBeNull();
  });

  it('keeps text when add fails', async () => {
    const addInboxTask = jest.fn().mockResolvedValue(false);
    renderWithStore({}, { addInboxTask });

    fireEvent.changeText(screen.getByPlaceholderText('Новая задача...'), 'Оставить в поле');
    await act(async () => {
      fireEvent.press(screen.getByTestId('quick-add-submit'));
    });

    expect(screen.getByDisplayValue('Оставить в поле')).toBeTruthy();
  });

  it('passes preferredDate to addInboxTask when provided', async () => {
    const addInboxTask = jest.fn().mockResolvedValue(true);
    renderWithStore({ preferredDate: '2026-04-03' }, { addInboxTask });

    fireEvent.changeText(screen.getByPlaceholderText('Новая задача...'), 'Задача на сегодня');
    await act(async () => {
      fireEvent.press(screen.getByTestId('quick-add-submit'));
    });

    expect(addInboxTask).toHaveBeenCalledWith({ title: 'Задача на сегодня', dueDate: '2026-04-03' });
  });

});
