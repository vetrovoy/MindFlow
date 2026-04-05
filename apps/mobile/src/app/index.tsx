import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { ThemeProvider } from '@shared/theme/theme-context';
import { AppStoreProvider, useMobileAppStore } from '@shared/model/app-store-provider';
import { AppToast } from '@shared/ui/primitives';
import { RootNavigator } from '@mobile/navigation';

function AppInit() {
  const reload = useMobileAppStore(s => s.actions.reload);

  useEffect(() => {
    reload();
  }, [reload]);

  return <RootNavigator />;
}

export function MindFlowApp() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <AppStoreProvider>
            <BottomSheetModalProvider>
              <AppInit />
              <AppToast />
            </BottomSheetModalProvider>
          </AppStoreProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
