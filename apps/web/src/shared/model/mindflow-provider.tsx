import { useEffect, type PropsWithChildren } from "react";
import { useShallow } from "zustand/react/shallow";

import { useMindFlowStore } from "./mindflow-store";

export function MindFlowProvider({ children }: PropsWithChildren) {
  const reload = useMindFlowStore((store) => store.actions.reload);

  useEffect(() => {
    void reload();
  }, [reload]);

  return children;
}

export function useMindFlowApp() {
  return useMindFlowStore(
    useShallow((store) => ({
      state: store.state,
      derived: store.derived,
      actions: store.actions
    }))
  );
}
