import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { PlaceholderEditModal } from "@/shared/ui";

export function TaskEditFeature() {
  const { actions, derived } = useMindFlowApp();
  const task = derived.editingTask;

  if (task == null) {
    return null;
  }

  return (
    <PlaceholderEditModal
      description="Скоро здесь будет полноценный редактор задачи. Пока оставляем аккуратную заглушку, чтобы спокойно собрать финальный UX."
      entityDescription="Реальные поля формы временно скрыты. На этом месте появится новая версия редактора, когда закрепим структуру взаимодействия."
      entityTitle={task.title}
      label="Текущая задача"
      onClose={() => {
        actions.closeTaskEdit();
      }}
      open={task != null}
      title="Заглушка редактирования задачи"
    />
  );
}
