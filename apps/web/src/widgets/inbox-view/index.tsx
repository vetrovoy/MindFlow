import type { Task } from "@mindflow/domain";
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

  const [laterTasks, completedTasks] = useMemo(() => {
    const later: Task[] = [];
    const completed: Task[] = [];

    for (const task of derived.inboxTasks) {
      if (task.status === "done") {
        completed.push(task);
        continue;
      }

      if (todayAndOverdueTasks.some((todayTask) => todayTask.id === task.id)) {
        continue;
      }

      later.push(task);
    }

    return [later, completed] as const;
  }, [derived.inboxTasks, todayAndOverdueTasks]);

  const badgeByTaskId = useMemo<Partial<Record<string, "today" | "overdue">>>(() => {
    const result: Partial<Record<string, "today" | "overdue">> = {};

    for (const task of todayAndOverdueTasks) {
      result[task.id] =
        task.dueDate != null && task.dueDate < todayDateKey ? "overdue" : "today";
    }

    return result;
  }, [todayAndOverdueTasks, todayDateKey]);

  return (
    <div className={styles.root}>
      <SurfaceCard>
        <SectionTitle
          subtitle="Сначала быстрое добавление, потом разбор. Откройте задачу, чтобы спокойно уточнить список, дату и детали."
          title="Входящие"
        />
        <div className={styles.content}>
          {derived.inboxTasks.length === 0 ? (
            <StateCard
              description="Входящие пусты. Добавьте задачу через быстрое поле, и она появится здесь."
              title="Во Входящих пусто"
              variant="empty"
            />
          ) : (
            <div className={styles.sections}>
              <CollapsibleSection count={todayAndOverdueTasks.length} defaultOpen title="Сегодня">
                {todayAndOverdueTasks.length === 0 ? (
                  <StateCard
                    description="Срочных задач на сегодня сейчас нет: ни просроченных, ни задач на сегодня, ни важных входящих."
                    title="Сегодня свободно"
                    variant="empty"
                  />
                ) : (
                  <TaskListEntity
                    badgeByTaskId={badgeByTaskId}
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={todayAndOverdueTasks}
                  />
                )}
              </CollapsibleSection>
              <CollapsibleSection count={laterTasks.length} defaultOpen title="Позже">
                {laterTasks.length === 0 ? (
                  <StateCard
                    description="Все активные входящие уже разобраны на сегодня."
                    title="Позже пусто"
                    variant="empty"
                  />
                ) : (
                  <TaskListEntity
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={laterTasks}
                  />
                )}
              </CollapsibleSection>
              <CollapsibleSection
                count={completedTasks.length}
                defaultOpen={false}
                title="Выполнено"
              >
                {completedTasks.length === 0 ? (
                  <StateCard
                    description="Когда завершите входящую задачу, она появится здесь."
                    title="Пока ничего не выполнено"
                    variant="empty"
                  />
                ) : (
                  <TaskListEntity
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={completedTasks}
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
