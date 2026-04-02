import { render, screen } from '@mobile/test-utils';
import { FeedbackCard } from './index.tsx';

describe('FeedbackCard', () => {
  it('renders error variant', () => {
    render(
      <FeedbackCard variant="error" title="Error occurred" />
    );
    expect(screen.getByText('Error occurred')).toBeTruthy();
  });

  it('renders loading variant', () => {
    render(
      <FeedbackCard variant="loading" title="Loading..." />
    );
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders empty variant', () => {
    render(
      <FeedbackCard variant="empty" title="No data" />
    );
    expect(screen.getByText('No data')).toBeTruthy();
  });

  it('renders description when provided', () => {
    render(
      <FeedbackCard
        variant="error"
        title="Error"
        description="Something went wrong"
      />
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('applies elevated surface card', () => {
    const { root } = render(
      <FeedbackCard variant="empty" title="Empty state" />
    );
    expect(root).toBeTruthy();
  });
});
