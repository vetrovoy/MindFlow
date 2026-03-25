import { PlaceholderEditModal } from "@/shared/ui";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";

export function ProjectEditFeature() {
  const { actions, derived } = useMindFlowApp();
  const project = derived.editingProject;

  if (project == null) {
    return null;
  }

  return (
    <PlaceholderEditModal
      description="Это временная заглушка списка. Полноценное редактирование проекта добавим следующим отдельным проходом."
      entityDescription="Клик по карточке списка теперь открывает эту заглушку. Это даёт нам чистую точку входа для будущего project editor."
      entityTitle={project.name}
      label="Текущий список"
      onClose={() => {
        actions.closeProjectEdit();
      }}
      open
      title="Заглушка редактирования списка"
    />
  );
}
