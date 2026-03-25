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
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import type { Task } from "@mindflow/domain";
import { TaskRowSortable } from "@/shared/ui/task-row-sortable";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import styles from "./index.module.css";
import { useCallback } from "react";

interface ProjectTaskReorderFeatureProps {
  projectId: string;
  tasks: Task[];
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

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
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
  }, []);

  if (tasks.length === 0) {
    return null;
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
              <TaskRowSortable
                key={task.id}
                showDragIcon={tasks.length !== 1}
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
