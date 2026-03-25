import { useMemo, useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import { BottomNavEntity } from "@/entities/navigation/ui/bottom-nav";
import { cn } from "@/shared/lib/cn";
import { ProjectEditFeature } from "@/features/project-edit";
import { QuickAddFeature } from "@/features/quick-add";
import { TaskEditFeature } from "@/features/task-edit";
import { InboxPage } from "@/pages/inbox";
import { ListsPage } from "@/pages/lists";
import { TodayPage } from "@/pages/today";
import { SystemStatusWidget } from "@/widgets/system-status";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { Display, MetaText, SupportText } from "@/shared/ui";
import { IconButton, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import styles from "@/app/App.module.css";
import { ProjectCreateFeature } from "@/features/project-create";

function AppShell() {
  const location = useLocation();
  const isLists = location.pathname === "/lists";
  const isInbox = location.pathname === "/inbox";
  const isToday = location.pathname === "/today";

  const { derived, state } = useMindFlowApp();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const tasksInListsCount = useMemo(
    () =>
      derived.projectSections.reduce(
        (total, section) =>
          total + section.tasks.filter((task) => task.status !== "done").length,
        0
      ),
    [derived.projectSections]
  );

  const tasksInInboxCount = useMemo(
    () => derived.inboxTasks.filter((task) => task.status !== "done").length,
    [derived.inboxTasks]
  );

  return (
    <div className={styles.shell}>
      <div className={`${styles.container} ${styles.header}`}>
        <SurfaceCard>
          <div className={styles.hero}>
            <div className={styles.heroTop}>
              <div>
                <Display as="h1" className={styles.title}>
                  Привет, Андрей
                </Display>
                <SupportText className={styles.subtitle}>
                  Сфокусируемся на главном сегодня
                </SupportText>
              </div>
              <div>
                <IconButton
                  ariaLabel={
                    isQuickAddOpen
                      ? "Скрыть быстрое добавление"
                      : "Открыть быстрое добавление"
                  }
                  className={styles.addButton}
                  icon="add"
                  onClick={() => {
                    setIsQuickAddOpen((current) => !current);
                  }}
                />
              </div>
            </div>
            <div className={styles.stats}>
              <section className={styles.statCard}>
                <MetaText className={styles.statLabel}>Входящие</MetaText>
                <Display as="strong" className={styles.statValue}>
                  {tasksInInboxCount}
                </Display>
              </section>
              <section className={styles.statCard}>
                <MetaText className={styles.statLabel}>В списках</MetaText>
                <Display as="strong" className={styles.statValueAccent}>
                  {tasksInListsCount}
                </Display>
              </section>
            </div>
            <nav aria-label="Переключение разделов" className={styles.topTabs}>
              <NavLink
                className={({ isActive }) =>
                  cn(styles.topTab, isActive && styles.topTabActive)
                }
                to="/inbox"
              >
                Входящие
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  cn(styles.topTab, isActive && styles.topTabActive)
                }
                to="/lists"
              >
                Списки
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  cn(styles.topTab, isActive && styles.topTabActive)
                }
                to="/today"
              >
                Сегодня
              </NavLink>
            </nav>
            {isQuickAddOpen && isInbox ? (
              <QuickAddFeature
                title="Быстрый захват задач"
                description="Добавляйте задачи без приоритета в течение дня."
              />
            ) : null}
            {isQuickAddOpen && isToday ? (
              <QuickAddFeature
                title="Быстрый захват задач"
                description="Добавляйте задачи на сегодня"
                preferredDate={new Date()}
              />
            ) : null}
            {isQuickAddOpen && isLists ? <ProjectCreateFeature /> : null}
            <SystemStatusWidget />
          </div>
        </SurfaceCard>
      </div>
      <main className={`${styles.container} ${styles.main}`}>
        {!state.isHydrated ? (
          <StateCard
            description="Поднимаем локальное хранилище и готовим офлайн-рабочее пространство."
            title="Загружаем локальное пространство"
            variant="loading"
          />
        ) : (
          <Outlet />
        )}
      </main>
      <BottomNavEntity />
      <TaskEditFeature />
      <ProjectEditFeature />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<Navigate replace to="/inbox" />} index />
        <Route element={<InboxPage />} path="/inbox" />
        <Route element={<ListsPage />} path="/lists" />
        <Route element={<TodayPage />} path="/today" />
      </Route>
      <Route element={<Navigate replace to="/inbox" />} path="*" />
    </Routes>
  );
}
