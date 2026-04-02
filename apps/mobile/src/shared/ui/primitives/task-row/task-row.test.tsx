import { render, screen, fireEvent } from '@mobile/test-utils';
import { TaskRow } from './index';
import type { Task, Project } from '@mindflow/domain';

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
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
};

const mockProject: Project = {
  id: 'project-1',
  name: 'Test Project',
  emoji: '📁',
  color: '#007AFF',
  isFavorite: false,
  deadline: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskRow', () => {
  it('renders task title', () => {
    render(
      <TaskRow task={mockTask} onToggleDone={() => {}} />
    );
    expect(screen.getByText('Test Task')).toBeTruthy();
  });

  it('renders priority', () => {
    render(
      <TaskRow task={mockTask} onToggleDone={() => {}} />
    );
    expect(screen.getByText('HIGH')).toBeTruthy();
  });

  it('renders status text', () => {
    render(
      <TaskRow task={mockTask} onToggleDone={() => {}} />
    );
    expect(screen.getByText('В работе')).toBeTruthy();
  });

  it('renders done status when task is completed', () => {
    const doneTask: Task = { ...mockTask, status: 'done' };
    render(
      <TaskRow task={doneTask} onToggleDone={() => {}} />
    );
    expect(screen.getByText('Готово')).toBeTruthy();
  });

  it('renders project when provided', () => {
    render(
      <TaskRow task={mockTask} onToggleDone={() => {}} project={mockProject} />
    );
    expect(screen.getByText('📁 Test Project')).toBeTruthy();
  });

  it('renders badge variant when provided', () => {
    render(
      <TaskRow
        task={mockTask}
        onToggleDone={() => {}}
        badgeVariant="today"
      />
    );
    expect(screen.getByText('TODAY')).toBeTruthy();
  });

  it('calls onToggleDone when checkbox is pressed', () => {
    const onToggleDone = jest.fn();
    render(
      <TaskRow task={mockTask} onToggleDone={onToggleDone} />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.press(checkbox);
    expect(onToggleDone).toHaveBeenCalledWith('task-1');
  });

  it('shows checked state for done task', () => {
    const doneTask: Task = { ...mockTask, status: 'done' };
    render(
      <TaskRow task={doneTask} onToggleDone={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.props.accessibilityState?.checked).toBe(true);
  });

  it('does not render badge when variant is not provided', () => {
    render(
      <TaskRow task={mockTask} onToggleDone={() => {}} />
    );
    expect(screen.queryByText('TODAY')).toBeNull();
    expect(screen.queryByText('OVERDUE')).toBeNull();
  });

  it('applies hitSlop to interactive targets', () => {
    render(
      <TaskRow task={mockTask} onToggleDone={() => {}} onOpenTask={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox');
    const button = screen.getByRole('button');
    expect(checkbox.props.hitSlop).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
    expect(button.props.hitSlop).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });
});
