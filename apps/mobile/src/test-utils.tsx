import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';

// Mocks are provided by jest.setup.js

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { ...options });
}

export * from '@testing-library/react-native';
export { customRender as render };
