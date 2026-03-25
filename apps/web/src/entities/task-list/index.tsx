import type { Task } from "@mindflow/domain";
import { TaskRow } from "../../shared/ui";
import styles from "./index.module.css";

interface TaskListEntityProps {
  tasks: Task[];
  selectedTaskIds?: string[];
  onToggleDone: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
  badgeByTaskId?: Partial<Record<string, "today" | "overdue">>;
}

export function TaskListEntity({
  badgeByTaskId,
  onOpenTask,
  onToggleDone,
  selectedTaskIds = [],
  tasks
}: TaskListEntityProps) {
  return (
    <div className={styles.row}>
      {tasks.map((task) => {
        const selected = selectedTaskIds.includes(task.id);
        const badgeVariant = badgeByTaskId?.[task.id];

        return (
          <TaskRow
            badgeVariant={badgeVariant}
            key={task.id}
            onOpenTask={onOpenTask}
            onToggleDone={onToggleDone}
            selected={selected}
            task={task}
          />
        );
      })}
    </div>
  );
}
