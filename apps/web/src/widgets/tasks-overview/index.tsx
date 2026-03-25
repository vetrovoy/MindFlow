import { QuickAddFeature } from "../../features/quick-add";
import { TaskListEntity } from "../../entities/task-list";

export function TasksOverviewWidget() {
  return (
    <main style={{ padding: 24 }}>
      <QuickAddFeature />
      <TaskListEntity />
    </main>
  );
}
