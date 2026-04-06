import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Lightweight connectivity hook.
 * Uses AppState + a background fetch probe to detect online/offline status.
 * TODO: replace probe with @react-native-community/netinfo when added.
 */
async function checkOnline(): Promise<boolean> {
  try {
    await fetch('https://clients3.google.com/generate_204', {
      method: 'HEAD',
      cache: 'no-store',
    });
    return true;
  } catch {
    return false;
  }
}

export function useNetworkStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      const online = await checkOnline();
      if (!cancelled) setIsOnline(online);
    }

    void probe();

    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') void probe();
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return { isOnline };
}
