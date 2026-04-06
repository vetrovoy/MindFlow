import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { ThemeProvider } from '@shared/theme/theme-context';
import { AppStoreProvider, useMobileAppStore } from '@shared/model/app-store-provider';
import { useAuthStore } from '@shared/model/auth-store';
import { AppToast } from '@shared/ui/primitives';
import { RootNavigator } from '@mobile/navigation';
import { AuthScreen } from '@mobile/features/auth/ui/auth-screen';

function AppInit() {
  const reload = useMobileAppStore(s => s.actions.reload);

  useEffect(() => {
    reload();
  }, [reload]);

  return <RootNavigator />;
}

function AppContent() {
  const session = useAuthStore(s => s.state.session);

  if (session == null) {
    return (
      <BottomSheetModalProvider>
        <AuthScreen />
      </BottomSheetModalProvider>
    );
  }

  return (
    <AppStoreProvider userId={session.userId}>
      <BottomSheetModalProvider>
        <AppInit />
        <AppToast />
      </BottomSheetModalProvider>
    </AppStoreProvider>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
