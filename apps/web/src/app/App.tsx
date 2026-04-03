import { Navigate, Route, Routes } from "react-router-dom";

import { RequireAuth } from "@/app/ui/require-auth";
import { AppShell } from "@/app/ui/app-shell";

import { AuthPage } from "@/pages/auth";
import { ArchivePage } from "@/pages/archive";
import { InboxPage } from "@/pages/inbox";
import { ListsPage } from "@/pages/lists";
import { SearchPage } from "@/pages/search";
import { TodayPage } from "@/pages/today";

export function App() {
  return (
    <Routes>
      <Route element={<AuthPage />} path="/" />
      <Route element={<RequireAuth />} path="/">
        <Route element={<AppShell />}>
          <Route element={<InboxPage />} path="inbox" />
          <Route element={<ListsPage />} path="lists" />
          <Route element={<SearchPage />} path="search" />
          <Route element={<ArchivePage />} path="archive" />
          <Route element={<TodayPage />} path="today" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
