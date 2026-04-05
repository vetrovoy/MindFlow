import { AppShell } from '../../app/ui/app-shell';
import { HomeTabNavigator } from '../home/tabs';

export function HomeTabsShell() {
  return (
    <AppShell>
      <HomeTabNavigator />
    </AppShell>
  );
}
