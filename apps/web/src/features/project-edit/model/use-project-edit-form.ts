import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const projectId = project?.id ?? "";
  const [draft, setDraft] = useState<ProjectEditFormValues>(DEFAULT_PROJECT_EDIT_VALUES);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const lastSyncedSignatureRef = useRef("");
  const hydratedProjectIdRef = useRef<string | null>(null);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
      setIsDraftReady(false);
      setDraft(DEFAULT_PROJECT_EDIT_VALUES);
      setNameError(null);
      return;
    }

    if (hydratedProjectIdRef.current === project.id) {
      return;
    }

    setIsDraftReady(false);

    const nextDraft: ProjectEditFormValues = {
      name: project.name,
      color: project.color,
      deadline: project.deadline ?? "",
      isFavorite: project.isFavorite
    };

    hydratedProjectIdRef.current = project.id;
    lastSyncedSignatureRef.current = createDraftSignature(nextDraft);
    setDraft(nextDraft);
    setNameError(null);
    setIsDraftReady(true);
  }, [project]);

  const buildSavePayload = useCallback((values: ProjectEditFormValues = draft) => {
    const normalizedName = values.name.trim();

    if (!normalizedName) {
      setNameError("У списка должно быть название, чтобы его можно было сохранить.");
      return null;
    }

    setNameError(null);

    return {
      projectId,
      name: normalizedName,
      color: values.color,
      isFavorite: values.isFavorite,
      deadline: values.deadline || null
    };
  }, [draft, projectId]);

  useEffect(() => {
    if (project == null || !isDraftReady || hydratedProjectIdRef.current !== project.id) {
      return;
    }

    const draftSignature = createDraftSignature(draft);
    if (draftSignature === lastSyncedSignatureRef.current) {
      return;
    }

    const payload = buildSavePayload(draft);
    if (payload == null) {
      return;
    }

    autosaveTimeoutRef.current = setTimeout(() => {
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
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [actions, buildSavePayload, draft, isDraftReady, project]);

  const flushAutosave = useCallback(async () => {
    const draftSignature = createDraftSignature(draft);
    if (!isDraftReady || draftSignature === lastSyncedSignatureRef.current) {
      return true;
    }

    const payload = buildSavePayload(draft);
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
  }, [actions, buildSavePayload, draft, isDraftReady]);

  const handleClose = useCallback(async () => {
    if (autosaveTimeoutRef.current != null) {
      clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }

    await flushAutosave();
    actions.closeProjectEdit();
  }, [actions, flushAutosave]);

  return {
    actions,
    handleClose,
    color: draft.color,
    deadline: draft.deadline,
    isFavorite: draft.isFavorite,
    name: draft.name,
    nameError,
    project,
    projectId,
    projectSummary,
    setColor(nextColor: string) {
      setDraft((current) => ({ ...current, color: nextColor }));
    },
    setDeadline(nextDeadline: string) {
      setDraft((current) => ({ ...current, deadline: nextDeadline }));
    },
    setFavorite(nextFavorite: boolean) {
      setDraft((current) => ({ ...current, isFavorite: nextFavorite }));
    },
    setName(nextName: string) {
      setDraft((current) => ({ ...current, name: nextName }));
      if (nameError != null) {
        setNameError(null);
      }
    },
    state
  };
}
