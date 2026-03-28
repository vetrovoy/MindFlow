import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/app/providers/auth-provider";

export function RequireAuth() {
  const location = useLocation();
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`
        }}
        to="/"
      />
    );
  }

  return <Outlet />;
}
