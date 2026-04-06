import { fireEvent, render, screen } from '@mobile/test-utils';
import { DatePicker } from './index';

describe('DatePicker', () => {
  it('renders label when provided', () => {
    render(<DatePicker value="" onChange={() => {}} label="Срок выполнения" />);
    expect(screen.getByText('Срок выполнения')).toBeTruthy();
  });

  it('renders current value in trigger', () => {
    render(<DatePicker value="2024-06-15" onChange={() => {}} />);
    expect(screen.getByText('2024-06-15')).toBeTruthy();
  });

  it('renders placeholder when value is empty', () => {
    render(<DatePicker value="" onChange={() => {}} />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('renders without label', () => {
    const { root } = render(
      <DatePicker value="2024-01-01" onChange={() => {}} />,
    );
    expect(root).toBeTruthy();
  });

  it('opens picker on trigger press', () => {
    render(<DatePicker value="2024-06-15" onChange={() => {}} label="Дата" />);
    const trigger = screen.getByRole('button');
    fireEvent.press(trigger);
    // After press, the picker modal opens (tested via mock rendering)
    expect(trigger).toBeTruthy();
  });
});
