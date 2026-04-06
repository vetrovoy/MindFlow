import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@shared/theme/use-theme';
import { SettingsTabNavigator } from '../settings';
import { AppDrawerOpener } from '@app/ui/app-drawer-opener';
import { FAB_SPACING } from '@shared/config/fab';
import { AppBack } from '@mobile/app/ui/app-back';

export function SettingsTabsShell() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <SettingsTabNavigator />
        <AppDrawerOpener bottom={FAB_SPACING.menu} />
        <AppBack bottom={FAB_SPACING.main} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
