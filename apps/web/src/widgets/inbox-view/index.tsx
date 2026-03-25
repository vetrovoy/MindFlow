import { useMemo } from "react";

import { TaskListEntity } from "@/entities/task-list";
import { getTodayDateKey } from "@/shared/lib/date";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  CollapsibleSection,
  SectionTitle,
  StateCard,
  SurfaceCard
} from "@/shared/ui";
import styles from "./index.module.css";

export function InboxViewWidget() {
  const { actions, derived } = useMindFlowApp();
  const todayDateKey = getTodayDateKey();
  const todayAndOverdueTasks = useMemo(
    () => derived.todayFeed.map((item) => item.task),
    [derived.todayFeed]
  );
  const { activeInboxTasks, completedInboxTasks } = useMemo(() => {
    const active = [];
    const completed = [];

    for (const task of derived.inboxTasks) {
      if (task.status === "done") {
        completed.push(task);
        continue;
      }

      active.push(task);
    }

    return {
      activeInboxTasks: active,
      completedInboxTasks: completed
    };
  }, [derived.inboxTasks]);

  const badgeByTaskId = useMemo<
    Partial<Record<string, "today" | "overdue">>
  >(() => {
    const result: Partial<Record<string, "today" | "overdue">> = {};

    for (const task of todayAndOverdueTasks) {
      result[task.id] =
        task.dueDate != null && task.dueDate < todayDateKey
          ? "overdue"
          : "today";
    }

    return result;
  }, [todayAndOverdueTasks, todayDateKey]);

  return (
    <div className={styles.root}>
      <SurfaceCard>
        <SectionTitle title="Входящие" />
        <div className={styles.content}>
          {derived.inboxTasks.length === 0 ? (
            <StateCard
              description="Добавьте задачу через быстрое поле, и она появится здесь."
              title="Пусто"
              variant="empty"
            />
          ) : (
            <div className={styles.sections}>
              {activeInboxTasks.length === 0 ? (
                <StateCard
                  description="Добавьте задачу через быстрое поле, и она появится здесь."
                  title="Пусто"
                  variant="empty"
                />
              ) : (
                <TaskListEntity
                  badgeByTaskId={badgeByTaskId}
                  onOpenTask={actions.openTaskEdit}
                  onToggleDone={(taskId) => {
                    void actions.toggleTask(taskId);
                  }}
                  tasks={activeInboxTasks}
                />
              )}
              <CollapsibleSection
                count={completedInboxTasks.length}
                defaultOpen={false}
                title="Выполненные"
              >
                {completedInboxTasks.length === 0 ? (
                  <StateCard
                    description="Завершите задачу и она появится здесь."
                    title="Пусто"
                    variant="empty"
                  />
                ) : (
                  <TaskListEntity
                    badgeByTaskId={badgeByTaskId}
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={completedInboxTasks}
                  />
                )}
              </CollapsibleSection>
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
