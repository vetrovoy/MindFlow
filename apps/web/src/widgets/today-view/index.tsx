import { useMemo } from "react";

import { useCopy } from "@/app/providers/language-provider";
import { TaskListEntity } from "@/entities/task-list";
import { useAppState } from "@/shared/model/app-store-provider";
import { CollapsibleSection } from "@/shared/ui";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import styles from "./index.module.css";

export function TodayViewWidget() {
  const copy = useCopy();
  const { actions, derived } = useAppState();
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
        <SectionTitle title={copy.today.title} />
        {derived.todayFeed.length === 0 ? (
          <StateCard
            description={copy.today.emptyDescription}
            title={copy.common.empty}
            variant="empty"
          />
        ) : (
          <div className={styles.sections}>
            {overdueTasks.length > 0 && (
              <CollapsibleSection
                count={overdueTasks.length}
                defaultOpen
                title={copy.today.overdueTitle}
              >
                <TaskListEntity
                  badgeByTaskId={badgeByTaskId}
                  onOpenTask={actions.openTaskEdit}
                  onToggleDone={(taskId) => {
                    void actions.toggleTask(taskId);
                  }}
                  tasks={overdueTasks}
                />
              </CollapsibleSection>
            )}
            {overdueTasks.length > 0 ? (
              todayTasks.length > 0 ? (
                <CollapsibleSection
                  count={todayTasks.length}
                  defaultOpen
                  title={copy.today.sectionTitle}
                >
                  <TaskListEntity
                    badgeByTaskId={badgeByTaskId}
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={todayTasks}
                  />
                </CollapsibleSection>
              ) : null
            ) : (
              <>
                {todayTasks.length === 0 ? (
                  <StateCard
                    description={copy.today.emptyDescription}
                    title={copy.today.emptyTitle}
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
              </>
            )}
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
