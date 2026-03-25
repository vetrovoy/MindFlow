import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CaptureForm } from "@/shared/ui";

export function ProjectCreateFeature() {
  const { actions, state } = useMindFlowApp();

  return (
    <CaptureForm
      disabled={state.isSaving}
      onSubmitValue={actions.createProject}
      placeholder="Создайте новый список проекта..."
      title="Создать список"
    />
  );
}
