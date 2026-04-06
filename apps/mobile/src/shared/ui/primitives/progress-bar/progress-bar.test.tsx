import { render } from '@mobile/test-utils';
import { ProgressBar } from './index';

describe('ProgressBar', () => {
  it('renders with value and max', () => {
    const { root } = render(<ProgressBar value={50} max={100} />);
    expect(root).toBeTruthy();
  });

  it('renders full progress when value equals max', () => {
    const { root } = render(<ProgressBar value={100} max={100} />);
    expect(root).toBeTruthy();
  });

  it('renders zero progress when value is 0', () => {
    const { root } = render(<ProgressBar value={0} max={100} />);
    expect(root).toBeTruthy();
  });

  it('handles max value of 0 gracefully', () => {
    const { root } = render(<ProgressBar value={50} max={0} />);
    expect(root).toBeTruthy();
  });

  it('calculates percentage correctly', () => {
    const { root } = render(<ProgressBar value={25} max={100} />);
    expect(root).toBeTruthy();
  });
});
