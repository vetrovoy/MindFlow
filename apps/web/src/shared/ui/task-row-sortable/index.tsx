import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Icon, TaskRow } from "@/shared/ui";
import type { Task } from "@mindflow/domain";

import { useCopy } from "@/app/providers/language-provider";
import styles from "./index.module.css";

interface TaskRowSortableProps {
  task: Task;
  onOpenTask: (taskId: string) => void;
  onToggleDone: (taskId: string) => void;
  showDragIcon?: boolean;
}
export function TaskRowSortable({
  onOpenTask,
  onToggleDone,
  task,
  showDragIcon = true
}: TaskRowSortableProps) {
  const copy = useCopy();
  const isDone = task.status === "done";
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: task.id,
    disabled: isDone
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <TaskRow
        className={styles.card}
        isDragging={isDragging}
        onOpenTask={onOpenTask}
        onToggleDone={onToggleDone}
        task={task}
        trailingSlot={
          showDragIcon &&
          !isDone && (
            <button
              {...attributes}
              {...listeners}
              aria-label={`${copy.taskReorder.title}: ${task.title}`}
              className={styles.dragHandle}
              type="button"
            >
              <Icon name="drag" size={16} tone="muted" />
            </button>
          )
        }
      />
    </div>
  );
}
