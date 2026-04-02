import React from 'react';

import type { AppStore } from '@shared/model/types';
import { render, screen } from '@mobile/test-utils';
import { ListsPage } from './lists-page';

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

  return render(<ListsPage />);
}

describe('ListsPage', () => {
  beforeEach(() => {
    mockUseMobileAppStore.mockReset();
    jest.clearAllMocks();
  });

  it('renders a single all-lists card with empty state when there are no sections', () => {
    renderWithStore();

    expect(screen.getByTestId('lists-all-card')).toBeTruthy();
    expect(screen.getByText('Все списки')).toBeTruthy();
    expect(screen.getByText('Пусто')).toBeTruthy();
    expect(screen.getByText('Создайте новый список.')).toBeTruthy();
  });

  it('removes legacy intro subtitle and intro card chrome', () => {
    renderWithStore();

    expect(screen.queryByText('Карточки проектов и прогресс-паттерны для следующих мобильных экранов.')).toBeNull();
    expect(screen.queryByText('Проекты')).toBeNull();
    expect(screen.queryByText('Пока нет проектов')).toBeNull();
    expect(screen.queryByText('Ждём первые списки')).toBeNull();
  });

  it('renders favorites and all-lists section cards from projectSections', () => {
    renderWithStore({
      derived: {
        projectSections: [
          {
            project: {
              id: 'project-fav',
              name: 'Избранный список',
              emoji: '⭐',
              color: '#F4B400',
              isFavorite: true,
              deadline: null,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
            },
            tasks: [],
            progress: { done: 1, total: 2, ratio: 0.5 },
          },
          {
            project: {
              id: 'project-regular',
              name: 'Обычный список',
              emoji: '🧩',
              color: '#4285F4',
              isFavorite: false,
              deadline: null,
              createdAt: '2026-04-01T09:00:00.000Z',
              updatedAt: '2026-04-01T09:00:00.000Z',
            },
            tasks: [],
            progress: { done: 0, total: 3, ratio: 0 },
          },
        ],
      },
    });

    expect(screen.getByTestId('lists-favorites-card')).toBeTruthy();
    expect(screen.getByTestId('lists-all-card')).toBeTruthy();
    expect(screen.getByText('Избранное')).toBeTruthy();
    expect(screen.getByText('Избранные списки остаются сверху для быстрого доступа.')).toBeTruthy();
    expect(screen.getByText('⭐ Избранный список')).toBeTruthy();
    expect(screen.getByText('🧩 Обычный список')).toBeTruthy();
  });

  it('does not render create CTA inside the page', () => {
    renderWithStore();

    expect(screen.queryByText('Создать список')).toBeNull();
    expect(screen.queryByText('Создайте новый список проекта...')).toBeNull();
  });
});
