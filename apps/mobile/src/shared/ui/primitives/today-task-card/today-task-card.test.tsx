import { render, screen, fireEvent } from '@mobile/test-utils';
import { TodayTaskCard } from './index';
import type { TodayTaskGroup } from '@mindflow/domain';

const mockTodayTaskGroup: TodayTaskGroup = {
  bucket: 'due-today',
  task: {
    id: 'task-1',
    title: 'Today Task',
    priority: 'high',
    status: 'todo',
    projectId: 'project-1',
    description: null,
    dueDate: null,
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    archivedAt: null,
  },
};

const mockOverdueTaskGroup: TodayTaskGroup = {
  ...mockTodayTaskGroup,
  bucket: 'overdue',
};

describe('TodayTaskCard', () => {
  it('renders task title', () => {
    render(
      <TodayTaskCard item={mockTodayTaskGroup} onToggleDone={() => {}} />
    );
    expect(screen.getByText('Today Task')).toBeTruthy();
  });

  it('renders today status pill', () => {
    render(
      <TodayTaskCard item={mockTodayTaskGroup} onToggleDone={() => {}} />
    );
    expect(screen.getByText('СЕГОДНЯ')).toBeTruthy();
  });

  it('renders overdue status pill', () => {
    render(
      <TodayTaskCard item={mockOverdueTaskGroup} onToggleDone={() => {}} />
    );
    expect(screen.getByText('ПРОСРОЧЕНО')).toBeTruthy();
  });

  it('does not render standalone bucket label above the row', () => {
    render(
      <TodayTaskCard item={mockTodayTaskGroup} onToggleDone={() => {}} />
    );

    // No standalone 'ПРОСРОЧЕНО' since bucket is due-today
    expect(screen.queryByText('ПРОСРОЧЕНО')).toBeNull();
    // No 'Inbox / high' metadata
    expect(screen.queryByText('Inbox / high')).toBeNull();
  });

  it('calls onToggleDone when task checkbox is pressed', () => {
    const onToggleDone = jest.fn();
    render(
      <TodayTaskCard item={mockTodayTaskGroup} onToggleDone={onToggleDone} />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.press(checkbox);
    expect(onToggleDone).toHaveBeenCalledWith('task-1');
  });

  it('forwards open task interaction', () => {
    const onOpenTask = jest.fn();
    render(
      <TodayTaskCard item={mockTodayTaskGroup} onOpenTask={onOpenTask} onToggleDone={() => {}} />
    );

    fireEvent.press(screen.getByText('Today Task'));

    expect(onOpenTask).toHaveBeenCalledWith('task-1');
  });
});
