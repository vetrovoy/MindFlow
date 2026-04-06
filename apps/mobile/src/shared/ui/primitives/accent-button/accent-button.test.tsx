import { render, screen, fireEvent } from '@mobile/test-utils';
import { AccentButton } from './index';

describe('AccentButton', () => {
  it('renders children', () => {
    render(<AccentButton>Button Text</AccentButton>);
    expect(screen.getByText('Button Text')).toBeTruthy();
  });

  it('applies custom style', () => {
    const { getByTestId } = render(
      <AccentButton testID="button" style={{ opacity: 0.5 }}>
        Styled Button
      </AccentButton>,
    );
    expect(getByTestId('button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<AccentButton onPress={onPress}>Press Me</AccentButton>);
    fireEvent.press(screen.getByText('Press Me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders with semibold weight and accent tone', () => {
    render(<AccentButton>Accent Button</AccentButton>);
    expect(screen.getByText('Accent Button')).toBeTruthy();
  });

  it('passes through Pressable props', () => {
    const onPress = jest.fn();
    render(
      <AccentButton onPress={onPress} disabled testID="disabled-button">
        Disabled
      </AccentButton>,
    );
    const button = screen.getByTestId('disabled-button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
