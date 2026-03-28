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
import { getMindFlowDatabaseName } from "./mindflow-store.config";
import { createMindFlowStore, type MindFlowStoreApi } from "./mindflow-store";

const MindFlowStoreContext = createContext<MindFlowStoreApi | null>(null);

export function MindFlowProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const store = useMemo(
    () =>
      session == null ? null : createMindFlowStore(getMindFlowDatabaseName(session.userId)),
    [session?.userId]
  );

  useEffect(() => {
    if (store == null) {
      return;
    }

    void store.getState().actions.reload();
  }, [store]);

  return (
    <MindFlowStoreContext.Provider value={store}>{children}</MindFlowStoreContext.Provider>
  );
}

export function useMindFlowApp() {
  const store = useContext(MindFlowStoreContext);

  if (store == null) {
    throw new Error("useMindFlowApp must be used within an authenticated MindFlowProvider");
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
