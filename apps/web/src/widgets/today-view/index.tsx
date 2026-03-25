import { TaskListEntity } from "@/entities/task-list";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import styles from "./index.module.css";

export function TodayViewWidget() {
  const { actions, derived } = useMindFlowApp();
  const badgeByTaskId: Partial<Record<string, "today" | "overdue">> = {};

  for (const { bucket, task } of derived.todayFeed) {
    badgeByTaskId[task.id] = bucket === "overdue" ? "overdue" : "today";
  }

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
          <TaskListEntity
            badgeByTaskId={badgeByTaskId}
            onOpenTask={actions.openTaskEdit}
            onToggleDone={(taskId) => {
              void actions.toggleTask(taskId);
            }}
            tasks={derived.todayFeed.map((item) => item.task)}
          />
        )}
      </div>
    </SurfaceCard>
  );
}
