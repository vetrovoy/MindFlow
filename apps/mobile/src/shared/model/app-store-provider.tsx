import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { getMobileAppStore, type AppStoreApi } from './app-store';
import type { AppStore } from './types';

const AppStoreContext = createContext<AppStoreApi | null>(null);

interface AppStoreProviderProps {
  children: React.ReactNode;
  userId: string;
}

export function AppStoreProvider({ children, userId }: AppStoreProviderProps) {
  const storeRef = useRef<AppStoreApi | null>(null);
  if (storeRef.current == null) {
    storeRef.current = getMobileAppStore(userId);
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
  return useStore(store, selector);
}
