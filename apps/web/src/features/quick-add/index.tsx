import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CaptureForm } from "@/shared/ui";

export function QuickAddFeature() {
  const { actions, state } = useMindFlowApp();

  return (
    <CaptureForm
      description="Добавляйте задачи без приоритета в течение дня. Разбор и планирование позже."
      disabled={state.isSaving}
      onSubmitValue={actions.addInboxTask}
      placeholder="Новая задача..."
      title="Быстрый захват задач"
    />
  );
}
