import { describe, expect, it } from "vitest";

import {
  buildProtectedRouteRedirect,
  getAuthRedirectTarget
} from "./app-routing";

describe("app routing helpers", () => {
  it("builds protected route redirects with search and hash intact", () => {
    expect(
      buildProtectedRouteRedirect("/search", "?q=archive", "#results")
    ).toBe("/search?q=archive#results");
  });

  it("resolves only safe in-app auth redirect targets", () => {
    expect(getAuthRedirectTarget({ from: "/archive?tab=tasks#item-1" })).toBe(
      "/archive?tab=tasks#item-1"
    );
    expect(getAuthRedirectTarget({ from: "https://evil.example" })).toBe(
      "/inbox"
    );
    expect(getAuthRedirectTarget({ from: "inbox" })).toBe("/inbox");
    expect(getAuthRedirectTarget(null)).toBe("/inbox");
  });
});
