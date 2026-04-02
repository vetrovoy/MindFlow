import { render } from '@mobile/test-utils';
import { Icon } from './index';

describe('Mobile Icon', () => {
  it('renders a shared icon contract through the mobile adapter', () => {
    const { UNSAFE_getByProps } = render(
      <Icon name="add" testID="mobile-icon" />
    );

    expect(UNSAFE_getByProps({ testID: 'mobile-icon' })).toBeTruthy();
  });

  it('supports semantic tones', () => {
    const { UNSAFE_getByProps } = render(
      <Icon name="toast-success" tone="success" testID="success-icon" />
    );

    expect(UNSAFE_getByProps({ testID: 'success-icon' })).toBeTruthy();
  });
});
