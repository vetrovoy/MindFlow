import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { PROJECT_DECORATIONS } from "@/shared/lib/projects";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  DEFAULT_PROJECT_EDIT_VALUES,
  type ProjectEditFormValues
} from "./project-edit.constants";

function createDraftSignature(values: ProjectEditFormValues) {
  return JSON.stringify(values);
}

export function useProjectEditForm() {
  const { actions, derived, state } = useMindFlowApp();
  const project = derived.editingProject;
  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    reset,
    setError,
    setValue
  } = useForm<ProjectEditFormValues>({
    defaultValues: DEFAULT_PROJECT_EDIT_VALUES
  });
  const name = useWatch({ control, name: "name" }) ?? "";
  const color = useWatch({ control, name: "color" }) ?? PROJECT_DECORATIONS[0].color;
  const deadline = useWatch({ control, name: "deadline" }) ?? "";
  const isFavorite = useWatch({ control, name: "isFavorite" }) ?? false;
  const lastSyncedSignatureRef = useRef("");
  const hydratedProjectIdRef = useRef<string | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const projectId = project?.id ?? "";

  const projectSummary = useMemo(() => {
    if (project == null) {
      return null;
    }

    return (
      derived.projectSections.find((section) => section.project.id === project.id) ?? {
        project,
        tasks: state.tasks.filter(
          (task) => task.projectId === project.id && task.archivedAt == null
        ),
        progress: {
          done: state.tasks.filter(
            (task) =>
              task.projectId === project.id &&
              task.archivedAt == null &&
              task.status === "done"
          ).length,
          total: state.tasks.filter(
            (task) => task.projectId === project.id && task.archivedAt == null
          ).length,
          ratio: 0
        }
      }
    );
  }, [derived.projectSections, project, state.tasks]);

  useEffect(() => {
    if (project == null) {
      hydratedProjectIdRef.current = null;
      if (autosaveTimeoutRef.current != null) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
      clearErrors();
      reset(DEFAULT_PROJECT_EDIT_VALUES);
      return;
    }

    if (hydratedProjectIdRef.current === project.id) {
      return;
    }

    const nextValues: ProjectEditFormValues = {
      name: project.name,
      color: project.color,
      deadline: project.deadline ?? "",
      isFavorite: project.isFavorite
    };

    reset(nextValues);
    clearErrors();
    hydratedProjectIdRef.current = project.id;
    lastSyncedSignatureRef.current = createDraftSignature(nextValues);
  }, [clearErrors, project, reset]);

  const currentDraft = useMemo(
    () => ({
      name,
      color,
      deadline,
      isFavorite
    }),
    [color, deadline, isFavorite, name]
  );

  const buildSavePayload = (values: ProjectEditFormValues = getValues()) => {
    const normalizedName = values.name.trim();

    if (!normalizedName) {
      setError("name", {
        type: "required",
        message: "У списка должно быть название, чтобы его можно было сохранить."
      });
      return null;
    }

    clearErrors("name");

    return {
      projectId,
      name: normalizedName,
      color: values.color,
      isFavorite: values.isFavorite,
      deadline: values.deadline || null
    };
  };

  useEffect(() => {
    if (project == null) {
      return;
    }

    if (hydratedProjectIdRef.current !== project.id) {
      return;
    }

    const draftSignature = createDraftSignature(currentDraft);
    if (draftSignature === lastSyncedSignatureRef.current) {
      return;
    }

    const payload = buildSavePayload(currentDraft);
    if (payload == null) {
      return;
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      void actions
        .saveProjectEdit(payload, {
          closeOnSuccess: false,
          toastOnSuccess: false
        })
        .then((saved) => {
          if (saved) {
            lastSyncedSignatureRef.current = draftSignature;
          }
        });
    }, 480);

    return () => {
      if (autosaveTimeoutRef.current != null) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [actions, currentDraft, project]);

  const flushAutosave = async () => {
    const draftSignature = createDraftSignature(getValues());
    if (draftSignature === lastSyncedSignatureRef.current) {
      return true;
    }

    const payload = buildSavePayload();
    if (payload == null) {
      return false;
    }

    const saved = await actions.saveProjectEdit(payload, {
      closeOnSuccess: false,
      toastOnSuccess: false
    });

    if (saved) {
      lastSyncedSignatureRef.current = draftSignature;
    }

    return saved;
  };

  async function handleClose() {
    if (autosaveTimeoutRef.current != null) {
      window.clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }

    await flushAutosave();
    actions.closeProjectEdit();
  }

  return {
    actions,
    clearErrors,
    color,
    control,
    deadline,
    errors,
    handleClose,
    isFavorite,
    name,
    project,
    projectId,
    projectSummary,
    setValue,
    state
  };
}
