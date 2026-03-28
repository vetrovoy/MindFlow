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
import { createAppStore, type AppStoreApi } from "./task-store";

const AppStoreContext = createContext<AppStoreApi | null>(null);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const store = useMemo(
    () => (session == null ? null : createAppStore(getUserDatabaseName(session.userId))),
    [session?.userId]
  );

  useEffect(() => {
    if (store == null) {
      return;
    }

    void store.getState().actions.reload();
  }, [store]);

  return (
    <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>
  );
}

export function useAppState() {
  const store = useContext(AppStoreContext);

  if (store == null) {
    throw new Error("useAppState must be used within an authenticated AppStoreProvider");
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
