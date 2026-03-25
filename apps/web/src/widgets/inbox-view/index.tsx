import { TaskListEntity } from "../../entities/task-list";
import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import {
  SectionTitle,
  StateCard,
  SurfaceCard
} from "../../shared/ui/primitives";
import styles from "./index.module.css";

export function InboxViewWidget() {
  const { actions, derived } = useMindFlowApp();

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
            <TaskListEntity
              onOpenTask={actions.openTaskEdit}
              onToggleDone={(taskId) => {
                void actions.toggleTask(taskId);
              }}
              tasks={derived.inboxTasks}
            />
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
