import { useMemo } from "react";

import { useCopy } from "@/app/providers/language-provider";
import { TaskListEntity } from "@/entities/task-list";
import { getTodayDateKey } from "@/shared/lib/date";
import { useAppState } from "@/shared/model/app-store-provider";
import {
  CollapsibleSection,
  SectionTitle,
  StateCard,
  SurfaceCard
} from "@/shared/ui";
import styles from "./index.module.css";

export function InboxViewWidget() {
  const copy = useCopy();
  const { actions, derived } = useAppState();
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
        <SectionTitle title={copy.inbox.title} />
        <div className={styles.content}>
          {derived.inboxTasks.length === 0 ? (
            <StateCard
              description={copy.inbox.emptyDescription}
              title={copy.common.empty}
              variant="empty"
            />
          ) : (
            <div className={styles.sections}>
              {activeInboxTasks.length > 0 ? (
                <TaskListEntity
                  badgeByTaskId={badgeByTaskId}
                  onOpenTask={actions.openTaskEdit}
                  onToggleDone={(taskId) => {
                    void actions.toggleTask(taskId);
                  }}
                  tasks={activeInboxTasks}
                />
              ) : null}
              {completedInboxTasks.length > 0 ? (
                <CollapsibleSection
                  count={completedInboxTasks.length}
                  defaultOpen={activeInboxTasks.length === 0}
                  title={copy.inbox.completedTitle}
                >
                  <TaskListEntity
                    badgeByTaskId={badgeByTaskId}
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={completedInboxTasks}
                  />
                </CollapsibleSection>
              ) : null}
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
