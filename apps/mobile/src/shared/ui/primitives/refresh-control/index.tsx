import { RefreshControl as RNRefreshControl } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';

interface RefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function RefreshControl({ refreshing, onRefresh }: RefreshControlProps) {
  const { theme } = useTheme();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[theme.colors.accentPrimary]}
      tintColor={theme.colors.accentPrimary}
    />
  );
}
