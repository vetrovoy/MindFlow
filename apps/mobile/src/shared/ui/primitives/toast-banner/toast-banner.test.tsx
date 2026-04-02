import { render, screen, fireEvent } from '@mobile/test-utils';
import { ToastBanner } from './index.tsx';

describe('ToastBanner', () => {
  it('renders title', () => {
    render(<ToastBanner title="Toast Title" />);
    expect(screen.getByText('Toast Title')).toBeTruthy();
  });

  it('renders description when provided', () => {
    render(
      <ToastBanner
        title="Title"
        description="Toast description"
      />
    );
    expect(screen.getByText('Toast description')).toBeTruthy();
  });

  it('renders info variant by default', () => {
    render(<ToastBanner title="Info Toast" />);
    expect(screen.getByText('Info Toast')).toBeTruthy();
  });

  it('renders success variant', () => {
    render(
      <ToastBanner title="Success" variant="success" />
    );
    expect(screen.getByText('Success')).toBeTruthy();
  });

  it('renders error variant', () => {
    render(
      <ToastBanner title="Error" variant="error" />
    );
    expect(screen.getByText('Error')).toBeTruthy();
  });

  it('calls onDismiss when pressed', () => {
    const onDismiss = jest.fn();
    render(
      <ToastBanner title="Dismissible" onDismiss={onDismiss} />
    );
    fireEvent.press(screen.getByText('Dismissible'));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('does not render description when not provided', () => {
    render(<ToastBanner title="No description" />);
    expect(screen.queryByText('Toast description')).toBeNull();
  });
});
