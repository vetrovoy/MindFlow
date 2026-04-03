import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/app/providers/auth-provider";
import { useCopy } from "@/app/providers/language-provider";
import { AppStats } from "@/app/ui/app-stats";
import { AppHeaderActions } from "@/app/ui/app-header-actions";

import { cn } from "@/shared/lib/cn";
import { ProjectEditFeature } from "@/features/project-edit";
import { QuickAddFeature } from "@/features/quick-add";
import { TaskCreateFeature } from "@/features/task-create";
import { TaskEditFeature } from "@/features/task-edit";

import { SystemStatusWidget } from "@/widgets/system-status";
import { BottomNavWidget } from "@/widgets/bottom-nav";
import { useAppState } from "@/shared/model/app-store-provider";
import { Display, SupportText } from "@/shared/ui";
import { StateCard, SurfaceCard } from "@/shared/ui/primitives";
import { ProjectCreateFeature } from "@/features/project-create";
import { ProjectCreateModalFeature } from "@/features/project-create/modal";
import styles from "./index.module.css";

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isInbox = location.pathname === "/inbox";
  const isLists = location.pathname === "/lists";
  const isSearch = location.pathname === "/search";
  const isArchive = location.pathname === "/archive";
  const isToday = location.pathname === "/today";
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [isProjectCreateOpen, setIsProjectCreateOpen] = useState(false);

  const copy = useCopy();
  const { session, signOut } = useAuth();
  const { state } = useAppState();

  const handleCreate = () => {
    if (isLists) {
      setIsProjectCreateOpen(true);
      return;
    }

    setIsTaskCreateOpen(true);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  const handleNavigate = (path: "/search" | "/archive") => {
    navigate(path);
  };

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
              <AppHeaderActions
                createAriaLabel={
                  isLists
                    ? copy.app.addProjectAriaLabel
                    : copy.app.addTaskAriaLabel
                }
                isArchive={isArchive}
                isSearch={isSearch}
                onCreate={handleCreate}
                onNavigate={handleNavigate}
                onSignOut={handleSignOut}
              />
            </div>
            <AppStats />
            <nav
              aria-label={copy.navigation.sectionAriaLabel}
              className={styles.topTabs}
            >
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
            {isToday || isInbox ? (
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
