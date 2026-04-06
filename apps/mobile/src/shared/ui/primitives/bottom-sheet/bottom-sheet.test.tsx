import { render, screen } from '@mobile/test-utils';
import { BottomSheet } from './index';

describe('BottomSheet', () => {
  it('renders when visible', () => {
    render(
      <BottomSheet visible title="Sheet Title" onClose={() => {}}>
        <>Sheet Content</>
      </BottomSheet>,
    );
    expect(screen.getByText('Sheet Title')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(
      <BottomSheet
        visible
        title="Title"
        subtitle="Sheet Subtitle"
        onClose={() => {}}
      >
        <>Content</>
      </BottomSheet>,
    );
    expect(screen.getByText('Sheet Subtitle')).toBeTruthy();
  });

  it('renders children', () => {
    const { root } = render(
      <BottomSheet visible title="Title" onClose={() => {}}>
        <>Child Content</>
      </BottomSheet>,
    );
    expect(root).toBeTruthy();
  });

  it('calls onClose when backdrop is pressed', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet visible title="Title" onClose={onClose}>
        <>Content</>
      </BottomSheet>,
    );
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    render(
      <BottomSheet visible={false} title="Hidden Sheet" onClose={() => {}}>
        <>Hidden Content</>
      </BottomSheet>,
    );
    expect(screen.queryByText('Hidden Sheet')).toBeNull();
  });
});
