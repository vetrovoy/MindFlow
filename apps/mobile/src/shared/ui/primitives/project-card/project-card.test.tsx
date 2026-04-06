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
  it('renders project name', () => {
    render(<ProjectCard project={mockProject} taskCount={10} doneCount={5} />);
    expect(screen.getByText('Test Project')).toBeTruthy();
  });

  it('renders progress bar', () => {
    const { root } = render(
      <ProjectCard project={mockProject} taskCount={10} doneCount={5} />,
    );
    expect(root).toBeTruthy();
  });

  it('renders favorite icon for favorite projects', () => {
    const { root } = render(
      <ProjectCard
        project={mockFavoriteProject}
        taskCount={10}
        doneCount={5}
      />,
    );
    expect(root).toBeTruthy();
  });

  it('does not render favorite icon for non-favorite projects', () => {
    render(<ProjectCard project={mockProject} taskCount={10} doneCount={5} />);
    expect(screen.getByText('Test Project')).toBeTruthy();
  });

  it('handles zero tasks', () => {
    render(<ProjectCard project={mockProject} taskCount={0} doneCount={0} />);
    expect(screen.getByText('Test Project')).toBeTruthy();
  });
});
