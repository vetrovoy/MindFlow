import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CaptureForm } from "@/shared/ui";

export function QuickAddFeature() {
  const { actions, state } = useMindFlowApp();

  return (
    <CaptureForm
      dateLabel="Срок"
      description="Добавляйте задачи без приоритета в течение дня. Разбор и планирование позже."
      disabled={state.isSaving}
      onSubmitValue={({ date, value }) =>
        actions.addInboxTask({
          title: value,
          dueDate: date
        })
      }
      placeholder="Новая задача..."
      title="Быстрый захват задач"
    />
  );
}
