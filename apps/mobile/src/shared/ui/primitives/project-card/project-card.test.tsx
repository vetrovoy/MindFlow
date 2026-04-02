import { render, screen } from '@mobile/test-utils';
import { ProjectCard } from './index';
import type { Project } from '@mindflow/domain';

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

const mockFavoriteProject: Project = {
  ...mockProject,
  isFavorite: true,
};

describe('ProjectCard', () => {
  it('renders project name with emoji', () => {
    render(
      <ProjectCard project={mockProject} taskCount={10} doneCount={5} />
    );
    expect(screen.getByText('📁 Test Project')).toBeTruthy();
  });

  it('renders task count', () => {
    render(
      <ProjectCard project={mockProject} taskCount={10} doneCount={5} />
    );
    expect(screen.getByText('5 из 10 завершено')).toBeTruthy();
  });

  it('renders progress bar', () => {
    const { root } = render(
      <ProjectCard project={mockProject} taskCount={10} doneCount={5} />
    );
    expect(root).toBeTruthy();
  });

  it('renders project color', () => {
    render(
      <ProjectCard project={mockProject} taskCount={10} doneCount={5} />
    );
    expect(screen.getByText('Цвет проекта: #007AFF')).toBeTruthy();
  });

  it('renders favorite badge for favorite projects', () => {
    render(
      <ProjectCard project={mockFavoriteProject} taskCount={10} doneCount={5} />
    );
    expect(screen.getByText('FAV')).toBeTruthy();
  });

  it('does not render favorite badge for non-favorite projects', () => {
    render(
      <ProjectCard project={mockProject} taskCount={10} doneCount={5} />
    );
    expect(screen.queryByText('FAV')).toBeNull();
  });

  it('handles zero tasks', () => {
    render(
      <ProjectCard project={mockProject} taskCount={0} doneCount={0} />
    );
    expect(screen.getByText('0 из 0 завершено')).toBeTruthy();
  });
});
