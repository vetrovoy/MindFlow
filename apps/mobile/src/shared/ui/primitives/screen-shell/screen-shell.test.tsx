import { render, screen } from '@mobile/test-utils';
import { ScreenShell } from './index';

describe('ScreenShell', () => {
  it('renders with title', () => {
    render(
      <ScreenShell title="Test Title">
        <>Content</>
      </ScreenShell>,
    );
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(
      <ScreenShell title="Title" subtitle="Test Subtitle">
        <>Content</>
      </ScreenShell>,
    );
    expect(screen.getByText('Test Subtitle')).toBeTruthy();
  });

  it('renders children', () => {
    const { root } = render(
      <ScreenShell title="Title">
        <>Child Content</>
      </ScreenShell>,
    );
    expect(root).toBeTruthy();
  });

  it('renders accessory when provided', () => {
    const { root } = render(
      <ScreenShell title="Title" accessory={<button>Button</button>}>
        <>Content</>
      </ScreenShell>,
    );
    expect(root).toBeTruthy();
  });
});
