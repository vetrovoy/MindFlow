/**
 * MindFlow Mobile App
 * Offline-first task manager for personal project planning
 */

import 'react-native-screens';

import { StatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MindFlowBootstrap } from './src/components/MindFlowBootstrap';

function App() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      <MindFlowBootstrap safeAreaInsets={safeAreaInsets} />
    </>
  );
}

export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
