import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from '@shared/theme/theme-context';
import { AppStoreProvider, useMobileAppStore } from '@shared/model/app-store-provider';
import { ToastBanner } from '@shared/ui/primitives';
import { RootNavigator } from './navigation';

function AppInit() {
  const reload = useMobileAppStore(s => s.actions.reload);
  const toast = useMobileAppStore(s => s.state.toast);
  const error = useMobileAppStore(s => s.state.error);
  const dismissToast = useMobileAppStore(s => s.actions.dismissToast);
  const clearError = useMobileAppStore(s => s.actions.clearError);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <>
      <RootNavigator />
      {toast ? (
        <ToastBanner
          title={toast.message}
          variant={toast.variant}
          onDismiss={dismissToast}
        />
      ) : null}
      {error ? (
        <ToastBanner
          title="Ошибка синхронизации"
          description={error}
          variant="error"
          onDismiss={clearError}
        />
      ) : null}
    </>
  );
}

export function MindFlowApp() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <AppStoreProvider>
          <AppInit />
        </AppStoreProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
