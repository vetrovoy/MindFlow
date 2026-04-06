import { fireEvent, render, screen } from '@mobile/test-utils';
import { ColorPicker } from './index';

describe('ColorPicker', () => {
  it('renders trigger field with current hex value', () => {
    render(<ColorPicker value="#4285F4" onChange={() => {}} />);
    expect(screen.getByText('#4285F4')).toBeTruthy();
  });

  it('renders placeholder dash when value is empty', () => {
    render(<ColorPicker value="" onChange={() => {}} />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('renders label when provided', () => {
    render(
      <ColorPicker value="#FF0000" onChange={() => {}} label="Цвет маркера" />,
    );
    expect(screen.getByText('Цвет маркера')).toBeTruthy();
  });

  it('does not show picker sheet before trigger press', () => {
    render(<ColorPicker value="#4285F4" onChange={() => {}} />);
    expect(screen.queryByText('Выберите цвет')).toBeNull();
  });

  it('opens BottomSheet on trigger press', () => {
    render(<ColorPicker value="#4285F4" onChange={() => {}} />);
    fireEvent.press(screen.getByRole('button'));
    expect(screen.getByText('Выберите цвет')).toBeTruthy();
  });
});
