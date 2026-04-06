import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RootDrawerParamList } from '@mobile/navigation/types';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
    gap: 10,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});

export function AppDrawerOpener({ bottom }: { bottom: number }) {
  const { theme } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  return (
    <View style={[styles.container, { bottom }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Открыть меню"
        onPress={() => {
          navigation.openDrawer();
        }}
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        <Icon decorative name="more" size={20} tone="muted" />
      </Pressable>
    </View>
  );
}
