import { useCopy } from "@/app/providers/language-provider";
import { useAppState } from "@/shared/model/app-store-provider";
import { CaptureForm } from "@/shared/ui";

export function ProjectCreateFeature() {
  const copy = useCopy();
  const { actions, state } = useAppState();

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
