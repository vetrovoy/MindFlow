import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren
} from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { useAuth } from "@/app/providers/auth-provider";
import { getUserDatabaseName } from "./app-storage.config";
import { createAppStore, resetAppStore, type AppStoreApi } from "./task-store";

const AppStoreContext = createContext<AppStoreApi | null>(null);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();

  // Depend on both userId AND accessToken so the store is re-created
  // when offline-registration-sync upgrades the session with a JWT.
  // This switches the repository from Dexie (local) to API (server).
  const hasToken = session?.accessToken != null;
  const storeKey = session
    ? `${session.userId}:${hasToken ? "api" : "local"}`
    : null;

  const store = useMemo(
    () =>
      session == null
        ? null
        : createAppStore(getUserDatabaseName(session.userId)),
    [storeKey]
  );

  useEffect(() => {
    if (store == null) {
      return;
    }

    void store.getState().actions.reload();

    return () => {
      resetAppStore();
    };
  }, [store]);

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppState() {
  const store = useContext(AppStoreContext);

  if (store == null) {
    throw new Error(
      "useAppState must be used within an authenticated AppStoreProvider"
    );
  }

  return useStore(
    store,
    useShallow((store) => ({
      state: store.state,
      derived: store.derived,
      actions: store.actions
    }))
  );
}
