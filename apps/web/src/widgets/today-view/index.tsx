import { useMemo } from "react";

import { TaskListEntity } from "@/entities/task-list";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CollapsibleSection } from "@/shared/ui";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import styles from "./index.module.css";

export function TodayViewWidget() {
  const { actions, derived } = useMindFlowApp();
  const { badgeByTaskId, overdueTasks, todayTasks } = useMemo(() => {
    const result: Partial<Record<string, "today" | "overdue">> = {};
    const overdue = [];
    const today = [];

    for (const { bucket, task } of derived.todayFeed) {
      if (bucket === "overdue") {
        result[task.id] = "overdue";
        overdue.push(task);
        continue;
      }

      result[task.id] = "today";
      today.push(task);
    }

    return {
      badgeByTaskId: result,
      overdueTasks: overdue,
      todayTasks: today
    };
  }, [derived.todayFeed]);

  return (
    <SurfaceCard>
      <div className={styles.root}>
        <SectionTitle
          subtitle="Сегодня формируется автоматически: сначала просроченные, затем на сегодня, затем важные задачи из Входящих."
          title="Сегодня"
        />
        {derived.todayFeed.length === 0 ? (
          <StateCard
            description="Задачи появляются здесь, когда становятся просроченными, назначены на сегодня или остаются высокоприоритетными во Входящих."
            title="Срочных задач сейчас нет"
            variant="empty"
          />
        ) : (
          <div className={styles.sections}>
            <CollapsibleSection count={overdueTasks.length} defaultOpen title="Просрочено">
              {overdueTasks.length === 0 ? (
                <StateCard
                  description="Просроченных задач сейчас нет."
                  title="Просрочено пусто"
                  variant="empty"
                />
              ) : (
                <TaskListEntity
                  badgeByTaskId={badgeByTaskId}
                  onOpenTask={actions.openTaskEdit}
                  onToggleDone={(taskId) => {
                    void actions.toggleTask(taskId);
                  }}
                  tasks={overdueTasks}
                />
              )}
            </CollapsibleSection>
            <CollapsibleSection count={todayTasks.length} defaultOpen title="Сегодня">
              {todayTasks.length === 0 ? (
                <StateCard
                  description="На сегодня сейчас нет задач. Важные входящие и задачи на сегодня появятся здесь автоматически."
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
                  tasks={todayTasks}
                />
              )}
            </CollapsibleSection>
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
