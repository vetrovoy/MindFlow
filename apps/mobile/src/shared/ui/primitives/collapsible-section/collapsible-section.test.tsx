import { fireEvent, render, screen } from '@mobile/test-utils';
import { Body } from '../../typography';
import { CollapsibleSection } from './index';

describe('CollapsibleSection', () => {
  it('renders children when defaultOpen is true', () => {
    render(
      <CollapsibleSection count={2} title="Completed">
        <Body>Child row</Body>
      </CollapsibleSection>
    );

    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('Child row')).toBeTruthy();
  });

  it('hides children when defaultOpen is false and toggles on press', () => {
    render(
      <CollapsibleSection defaultOpen={false} title="Completed">
        <Body>Hidden row</Body>
      </CollapsibleSection>
    );

    expect(screen.queryByText('Hidden row')).toBeNull();

    fireEvent.press(screen.getByText('Completed'));

    expect(screen.getByText('Hidden row')).toBeTruthy();
  });

  it('updates expanded accessibility state when toggled', () => {
    render(
      <CollapsibleSection defaultOpen={false} title="Completed">
        <Body>Hidden row</Body>
      </CollapsibleSection>
    );

    const trigger = screen.getByRole('button');

    expect(trigger.props.accessibilityState).toEqual({ expanded: false });

    fireEvent.press(trigger);

    expect(screen.getByRole('button').props.accessibilityState).toEqual({ expanded: true });
  });

  it('keeps manual close after parent rerender when defaultOpen is true', () => {
    const { rerender } = render(
      <CollapsibleSection defaultOpen title="Completed">
        <Body>Sticky row</Body>
      </CollapsibleSection>
    );

    fireEvent.press(screen.getByRole('button'));

    expect(screen.queryByText('Sticky row')).toBeNull();

    rerender(
      <CollapsibleSection defaultOpen title="Completed">
        <Body>Sticky row</Body>
      </CollapsibleSection>
    );

    expect(screen.queryByText('Sticky row')).toBeNull();
  });
});
