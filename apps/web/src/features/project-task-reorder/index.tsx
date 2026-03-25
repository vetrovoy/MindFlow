import {
  DndContext,
  PointerSensor,
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
import { getCheckboxStateLabel } from "@mindflow/ui";

import { cn } from "../../shared/lib/cn";
import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import { ActionButton, Icon } from "../../shared/ui";
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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id
  });

  return (
    <article
      className={styles.card}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <div className={styles.cardRow}>
        <div className={styles.cardMain}>
          <button
            aria-label={task.status === "done" ? "Вернуть задачу в работу" : "Отметить задачу выполненной"}
            className={cn(styles.checkbox, task.status === "done" && styles.checkboxDone)}
            onClick={() => {
              void onToggleDone(task.id);
            }}
          type="button"
        >
          {task.status === "done" ? <Icon name="check" size={16} tone="contrast" /> : null}
        </button>
          <button
            className={styles.contentButton}
            onClick={() => {
              onOpenTask(task.id);
            }}
            type="button"
          >
            <strong className={cn(styles.title, task.status === "done" && styles.titleDone)}>
              {task.title}
            </strong>
            <div className={styles.meta}>
              <span className={getPriorityTone(task.priority)}>
                {task.priority === "high"
                  ? "Высокий"
                  : task.priority === "medium"
                    ? "Средний"
                    : "Низкий"}
              </span>
              <span>
                {getCheckboxStateLabel(task.status === "done" ? "checked" : "unchecked") ===
                "Done"
                  ? "Готово"
                  : "В работе"}
              </span>
              {task.dueDate == null ? null : <span>{task.dueDate}</span>}
            </div>
          </button>
        </div>
        <button
          {...attributes}
          {...listeners}
          aria-label={`Изменить порядок задачи ${task.title}`}
          className={styles.dragHandle}
          type="button"
        >
          <Icon name="chevron-right" size={16} tone="muted" />
          <span>Тяни</span>
        </button>
      </div>
    </article>
  );
}

export function ProjectTaskReorderFeature({
  projectId,
  tasks
}: ProjectTaskReorderFeatureProps) {
  const { actions, state } = useMindFlowApp();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          Перетаскивайте задачи, чтобы выставить реальный порядок выполнения внутри списка.
        </p>
        {state.isSaving ? (
          <ActionButton disabled variant="secondary">
            Сохраняем порядок
          </ActionButton>
        ) : null}
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          void handleDragEnd(event);
        }}
        sensors={sensors}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
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
