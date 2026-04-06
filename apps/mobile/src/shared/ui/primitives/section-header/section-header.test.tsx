import { render, screen } from '@mobile/test-utils';
import { SectionHeader } from './index';

describe('SectionHeader', () => {
  it('renders title', () => {
    render(<SectionHeader title="Section Title" />);
    expect(screen.getByText('Section Title')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(<SectionHeader title="Title" subtitle="Section Subtitle" />);
    expect(screen.getByText('Section Subtitle')).toBeTruthy();
  });

  it('renders action when provided', () => {
    const { root } = render(
      <SectionHeader title="Title" action={<button>Action</button>} />,
    );
    expect(root).toBeTruthy();
  });

  it('renders all elements together', () => {
    const { root } = render(
      <SectionHeader
        title="Main Title"
        subtitle="Description"
        action={<button>Edit</button>}
      />,
    );
    expect(root).toBeTruthy();
    expect(screen.getByText('Main Title')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
  });
});
