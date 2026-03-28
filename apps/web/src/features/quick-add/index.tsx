import { useMemo } from "react";

import { useCopy } from "@/app/providers/language-provider";
import { getTodayDateKey } from "@/shared/lib/date";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { CaptureForm } from "@/shared/ui";

interface QuickAddFeatureProps {
  description: string;
  title: string;
  preferredDate?: Date | string;
}

function resolvePreferredDate(preferredDate?: Date | string) {
  if (preferredDate == null) {
    return null;
  }

  if (typeof preferredDate === "string") {
    return preferredDate;
  }

  return getTodayDateKey(preferredDate);
}

export function QuickAddFeature({
  description,
  title,
  preferredDate
}: QuickAddFeatureProps) {
  const copy = useCopy();
  const { actions, state } = useMindFlowApp();
  const resolvedPreferredDate = useMemo(
    () => resolvePreferredDate(preferredDate),
    [preferredDate]
  );

  return (
    <CaptureForm
      disabled={state.isSaving}
      description={description}
      onSubmitValue={({ date, value }) => {
        return actions.addInboxTask({
          title: value,
          dueDate: resolvedPreferredDate ?? date
        });
      }}
      placeholder={copy.quickCapture.taskPlaceholder}
      preferredDate={resolvedPreferredDate}
      showDatePicker={resolvedPreferredDate == null}
      title={title}
    />
  );
}
