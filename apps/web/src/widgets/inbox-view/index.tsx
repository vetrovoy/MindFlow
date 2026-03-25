import type { Task } from "@mindflow/domain";
import { useMemo, useState } from "react";

import { TaskListEntity } from "@/entities/task-list";
import { getTodayDateKey } from "@/shared/lib/date";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  Icon,
  MetaText,
  SectionTitle,
  StateCard,
  SurfaceCard
} from "@/shared/ui";
import styles from "./index.module.css";

interface InboxSectionProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  tasks: Task[];
  badgeByTaskId?: Partial<Record<string, "today" | "overdue">>;
  onOpenTask: (taskId: string) => void;
  onToggleDone: (taskId: string) => void;
}

function InboxSection({
  badgeByTaskId,
  count,
  defaultOpen = true,
  emptyDescription,
  emptyTitle,
  onOpenTask,
  onToggleDone,
  tasks,
  title
}: InboxSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={styles.section}>
      <button
        aria-expanded={isOpen}
        className={styles.sectionHeader}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
        type="button"
      >
        <div className={styles.sectionHeading}>
          <strong className={styles.sectionTitle}>{title}</strong>
          <MetaText className={styles.sectionCount}>{count}</MetaText>
        </div>
        <span className={styles.sectionChevron}>
          <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={16} tone="muted" />
        </span>
      </button>
      {isOpen ? (
        tasks.length === 0 ? (
          <StateCard
            description={emptyDescription}
            title={emptyTitle}
            variant="empty"
          />
        ) : (
          <TaskListEntity
            badgeByTaskId={badgeByTaskId}
            onOpenTask={onOpenTask}
            onToggleDone={onToggleDone}
            tasks={tasks}
          />
        )
      ) : null}
    </section>
  );
}

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
              <InboxSection
                badgeByTaskId={badgeByTaskId}
                count={todayAndOverdueTasks.length}
                defaultOpen
                emptyDescription="Срочных задач на сегодня сейчас нет: ни просроченных, ни задач на сегодня, ни важных входящих."
                emptyTitle="Сегодня свободно"
                onOpenTask={actions.openTaskEdit}
                onToggleDone={(taskId) => {
                  void actions.toggleTask(taskId);
                }}
                tasks={todayAndOverdueTasks}
                title="Сегодня"
              />
              <InboxSection
                count={laterTasks.length}
                defaultOpen
                emptyDescription="Все активные входящие уже разобраны на сегодня."
                emptyTitle="Позже пусто"
                onOpenTask={actions.openTaskEdit}
                onToggleDone={(taskId) => {
                  void actions.toggleTask(taskId);
                }}
                tasks={laterTasks}
                title="Позже"
              />
              <InboxSection
                count={completedTasks.length}
                defaultOpen={false}
                emptyDescription="Когда завершите входящую задачу, она появится здесь."
                emptyTitle="Пока ничего не выполнено"
                onOpenTask={actions.openTaskEdit}
                onToggleDone={(taskId) => {
                  void actions.toggleTask(taskId);
                }}
                tasks={completedTasks}
                title="Выполнено"
              />
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
