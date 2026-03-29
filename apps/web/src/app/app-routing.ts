interface RedirectState {
  from?: string;
}

export function getAuthRedirectTarget(state: unknown) {
  const candidate = state as RedirectState | null;

  return typeof candidate?.from === "string" && candidate.from.startsWith("/")
    ? candidate.from
    : "/inbox";
}

export function buildProtectedRouteRedirect(pathname: string, search = "", hash = "") {
  return `${pathname}${search}${hash}`;
}
