import { useCopy } from "@/app/providers/language-provider";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CaptureForm } from "@/shared/ui";

export function ProjectCreateFeature() {
  const copy = useCopy();
  const { actions, state } = useMindFlowApp();

  return (
    <CaptureForm
      disabled={state.isSaving}
      onSubmitValue={({ date, value }) =>
        actions.createProject({
          name: value,
          deadline: date
        })
      }
      placeholder={copy.quickCapture.projectPlaceholder}
      description={copy.quickCapture.createProjectDescription}
      title={copy.quickCapture.createProjectTitle}
    />
  );
}
