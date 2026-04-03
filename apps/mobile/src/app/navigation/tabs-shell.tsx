import { AppShell } from '../ui/app-shell';
import { TabNavigator } from './tabs-navigator';

export function TabsShell() {
  return (
    <AppShell>
      <TabNavigator />
    </AppShell>
  );
}
