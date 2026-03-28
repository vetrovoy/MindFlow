import { useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useAuth } from "@/app/providers/auth-provider";
import { useCopy } from "@/app/providers/language-provider";
import { AppStats } from "@/app/ui/app-stats";
import { LanguageToggle } from "@/app/ui/language-toggle";
import { RequireAuth } from "@/app/ui/require-auth";
import { cn } from "@/shared/lib/cn";
import { ProjectEditFeature } from "@/features/project-edit";
import { QuickAddFeature } from "@/features/quick-add";
import { TaskCreateFeature } from "@/features/task-create";
import { TaskEditFeature } from "@/features/task-edit";
import { AuthPage } from "@/pages/auth";
import { InboxPage } from "@/pages/inbox";
import { ListsPage } from "@/pages/lists";
import { TodayPage } from "@/pages/today";
import { SystemStatusWidget } from "@/widgets/system-status";
import { BottomNavWidget } from "@/widgets/bottom-nav";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { Display, SupportText } from "@/shared/ui";
import { IconButton, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import { ProjectCreateFeature } from "@/features/project-create";
import { ProjectCreateModalFeature } from "@/features/project-create/modal";
import styles from "@/app/App.module.css";

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLists = location.pathname === "/lists";
  const isToday = location.pathname === "/today";
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [isProjectCreateOpen, setIsProjectCreateOpen] = useState(false);

  const copy = useCopy();
  const { session, signOut } = useAuth();
  const { state } = useMindFlowApp();

  return (
    <div className={styles.shell}>
      <div className={`${styles.container} ${styles.header}`}>
        <SurfaceCard>
          <div className={styles.hero}>
            <div className={styles.heroTop}>
              <div>
                <Display as="h1" className={styles.title}>
                  {`${copy.app.greeting} ${session?.name ?? ""}`.trim()}
                </Display>
                <SupportText className={styles.subtitle}>
                  {copy.app.subtitle}
                </SupportText>
              </div>
              <div className={styles.headerActions}>
                <LanguageToggle />
                <IconButton
                  ariaLabel={copy.auth.signOutAriaLabel}
                  className={styles.signOutButton}
                  icon="sign-out"
                  onClick={() => {
                    signOut();
                    navigate("/", { replace: true });
                  }}
                  variant="secondary"
                />
                <IconButton
                  ariaLabel={
                    isLists ? copy.app.addProjectAriaLabel : copy.app.addTaskAriaLabel
                  }
                  className={styles.addButton}
                  icon="add"
                  onClick={() => {
                    if (isLists) {
                      setIsProjectCreateOpen(true);
                      return;
                    }

                    setIsTaskCreateOpen(true);
                  }}
                />
              </div>
            </div>
            <AppStats />
            <nav aria-label={copy.navigation.sectionAriaLabel} className={styles.topTabs}>
              <NavLink
                className={({ isActive }) =>
                  cn(styles.topTab, isActive && styles.topTabActive)
                }
                to="/inbox"
              >
                {copy.navigation.inbox}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  cn(styles.topTab, isActive && styles.topTabActive)
                }
                to="/lists"
              >
                {copy.navigation.lists}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  cn(styles.topTab, isActive && styles.topTabActive)
                }
                to="/today"
              >
                {copy.navigation.today}
              </NavLink>
            </nav>
            {isToday || location.pathname === "/inbox" ? (
              <QuickAddFeature
                description={
                  isToday
                    ? copy.quickCapture.todayDescription
                    : copy.quickCapture.inboxDescription
                }
                preferredDate={isToday ? new Date() : undefined}
                title={copy.quickCapture.title}
              />
            ) : null}
            {isLists ? <ProjectCreateFeature /> : null}
            <SystemStatusWidget />
          </div>
        </SurfaceCard>
      </div>
      <main className={`${styles.container} ${styles.main}`}>
        {!state.isHydrated ? (
          <StateCard
            description={copy.app.hydrationDescription}
            title={copy.app.hydrationTitle}
            variant="loading"
          />
        ) : (
          <Outlet />
        )}
      </main>
      <BottomNavWidget />
      <TaskCreateFeature
        onClose={() => {
          setIsTaskCreateOpen(false);
        }}
        open={isTaskCreateOpen}
        preferredDate={isToday ? new Date() : undefined}
      />
      <ProjectCreateModalFeature
        onClose={() => {
          setIsProjectCreateOpen(false);
        }}
        open={isProjectCreateOpen}
      />
      <TaskEditFeature />
      <ProjectEditFeature />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AuthPage />} path="/" />
      <Route element={<RequireAuth />} path="/">
        <Route element={<AppShell />}>
          <Route element={<InboxPage />} path="inbox" />
          <Route element={<ListsPage />} path="lists" />
          <Route element={<TodayPage />} path="today" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
