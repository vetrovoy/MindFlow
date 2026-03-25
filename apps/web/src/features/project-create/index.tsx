import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CaptureForm } from "@/shared/ui";

export function ProjectCreateFeature() {
  const { actions, state } = useMindFlowApp();

  return (
    <CaptureForm
      dateLabel="Дедлайн"
      disabled={state.isSaving}
      onSubmitValue={({ date, value }) =>
        actions.createProject({
          name: value,
          deadline: date
        })
      }
      placeholder="Создайте новый список проекта..."
      description="Создайте список и планируйте задачи."
      title="Создать список"
    />
  );
}
