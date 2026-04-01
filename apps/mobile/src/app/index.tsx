import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { ThemeProvider } from '@shared/theme/theme-context';
import { AppStoreProvider, useMobileAppStore } from '@shared/model/app-store-provider';
import { RootNavigator } from './navigation';

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
