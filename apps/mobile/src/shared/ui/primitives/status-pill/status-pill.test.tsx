import { render, screen } from '@mobile/test-utils';
import { StatusPill } from './index.tsx';

describe('StatusPill', () => {
  it('renders with label', () => {
    render(<StatusPill label="Today" variant="today" />);
    expect(screen.getByText('TODAY')).toBeTruthy();
  });

  it('renders today variant', () => {
    render(<StatusPill label="Today" variant="today" />);
    expect(screen.getByText('TODAY')).toBeTruthy();
  });

  it('renders overdue variant', () => {
    render(<StatusPill label="Overdue" variant="overdue" />);
    expect(screen.getByText('OVERDUE')).toBeTruthy();
  });

  it('renders neutral variant', () => {
    render(<StatusPill label="Neutral" variant="neutral" />);
    expect(screen.getByText('NEUTRAL')).toBeTruthy();
  });

  it('uppercases the label', () => {
    render(<StatusPill label="lowercase" variant="today" />);
    expect(screen.getByText('LOWERCASE')).toBeTruthy();
  });
});
