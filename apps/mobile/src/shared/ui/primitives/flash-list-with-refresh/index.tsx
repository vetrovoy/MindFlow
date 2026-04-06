import { createElement, type ComponentProps, type ReactElement } from 'react';
import type { RefreshControlProps } from 'react-native';
import { FlashList } from '@shopify/flash-list';

interface FlashListWithRefreshProps<T> extends Omit<
  ComponentProps<typeof FlashList<T>>,
  'refreshControl'
> {
  refreshControl?: ReactElement<RefreshControlProps>;
}

export function FlashListWithRefresh<T extends Record<string, any>>(
  props: FlashListWithRefreshProps<T>,
): ReactElement {
  const { refreshControl, ...rest } = props;
  return createElement(FlashList, {
    ...rest,
    refreshControl,
  });
}
