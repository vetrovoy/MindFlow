import { QuickAddFeature } from "../../features/quick-add";
import { TaskListEntity } from "../../entities/task-list";

export function TasksOverviewWidget() {
  return (
    <>
      <QuickAddFeature />
      <TaskListEntity />
    </>
  );
}
