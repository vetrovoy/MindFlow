import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@mindflow/domain";

import { cn } from "@/shared/lib/cn";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { Icon } from "@/shared/ui";
import styles from "./index.module.css";

interface ProjectTaskReorderFeatureProps {
  projectId: string;
  tasks: Task[];
}

interface SortableTaskCardProps {
  task: Task;
  onOpenTask: (taskId: string) => void;
  onToggleDone: (taskId: string) => void;
}

function getPriorityTone(priority: Task["priority"]) {
  if (priority === "high") {
    return styles.priorityHigh;
  }

  if (priority === "medium") {
    return styles.priorityMedium;
  }

  return styles.priorityLow;
}

function SortableTaskCard({
  onOpenTask,
  onToggleDone,
  task
}: SortableTaskCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: task.id
  });
  const isDone = task.status === "done";
  return (
    <article
      className={cn(
        styles.card,
        isDragging && styles.cardDragging,
        getPriorityTone(task.priority)
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <div className={styles.cardRow}>
        <div className={styles.cardMain}>
          <button
            aria-label={
              isDone ? "Вернуть задачу в работу" : "Отметить задачу выполненной"
            }
            className={cn(styles.checkbox, isDone && styles.checkboxDone)}
            onClick={() => {
              void onToggleDone(task.id);
            }}
            type="button"
          >
            {isDone ? <Icon name="check" size={14} tone="contrast" /> : null}
          </button>
          <button
            className={styles.contentButton}
            onClick={() => {
              onOpenTask(task.id);
            }}
            type="button"
          >
            <strong className={cn(styles.title, isDone && styles.titleDone)}>
              {task.title}
            </strong>
          </button>
        </div>
        <button
          {...attributes}
          {...listeners}
          aria-label={`Изменить порядок задачи ${task.title}`}
          className={styles.dragHandle}
          type="button"
        >
          <Icon name="drag" size={16} tone="muted" />
        </button>
      </div>
    </article>
  );
}

export function ProjectTaskReorderFeature({
  projectId,
  tasks
}: ProjectTaskReorderFeatureProps) {
  const { actions } = useMindFlowApp();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 140, tolerance: 8 }
    })
  );

  if (tasks.length === 0) {
    return null;
  }

  async function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over == null ? null : String(event.over.id);

    if (overId == null || activeId === overId) {
      return;
    }

    const currentOrder = tasks.map((task) => task.id);
    const oldIndex = currentOrder.indexOf(activeId);
    const newIndex = currentOrder.indexOf(overId);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
    await actions.reorderProjectTasks(projectId, nextOrder);
  }

  return (
    <div className={styles.root}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          void handleDragEnd(event);
        }}
        sensors={sensors}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list}>
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                onOpenTask={actions.openTaskEdit}
                onToggleDone={actions.toggleTask}
                task={task}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
