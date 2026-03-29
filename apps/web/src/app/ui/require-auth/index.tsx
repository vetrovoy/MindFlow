import { Navigate, Outlet, useLocation } from "react-router-dom";

import { buildProtectedRouteRedirect } from "@/app/app-routing";
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
          from: buildProtectedRouteRedirect(
            location.pathname,
            location.search,
            location.hash
          )
        }}
        to="/"
      />
    );
  }

  return <Outlet />;
}
