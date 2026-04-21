import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
  getMobileAppStore,
  resetMobileAppStore,
  type AppStoreApi,
} from './app-store';
import type { AppStore } from './types';
import { useAuthStore, initOfflineRegistrationSync } from './auth-store';

const AppStoreContext = createContext<AppStoreApi | null>(null);

interface AppStoreProviderProps {
  children: React.ReactNode;
  userId: string;
}

export function AppStoreProvider({ children, userId }: AppStoreProviderProps) {
  const storeRef = useRef<AppStoreApi | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Subscribe to accessToken so the store is re-created when
  // offline-registration-sync upgrades the session with a JWT.
  const hasToken = useAuthStore(s => s.state.session?.accessToken != null);
  const storeKey = `${userId}:${hasToken ? 'api' : 'local'}`;

  // Initialize offline registration sync on first mount
  useEffect(() => {
    const stop = initOfflineRegistrationSync();
    return stop;
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Reset previous store and create new one
    resetMobileAppStore();
    storeRef.current = null;
    setIsReady(false);

    getMobileAppStore(userId).then(store => {
      if (!cancelled) {
        storeRef.current = store;
        setIsReady(true);
      }
    });

    return () => {
      // Only mark as cancelled — don't call resetMobileAppStore() here
      // because it would tear down the new store created by the next effect
      cancelled = true;
    };
  }, [storeKey]);

  if (!isReady || storeRef.current == null) {
    // Return placeholder — app root should handle null context gracefully
    return null;
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

function useAppStoreApi(): AppStoreApi {
  const store = useContext(AppStoreContext);
  if (store == null) {
    throw new Error('useMobileAppStore must be used inside AppStoreProvider');
  }
  return store;
}

export function useMobileAppStore<T>(selector: (store: AppStore) => T): T {
  const store = useAppStoreApi();
  return useStore(store, useShallow(selector));
}
