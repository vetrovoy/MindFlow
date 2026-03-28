import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import { formatDisplayDate } from "@mindflow/copy";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useCopy, useLanguage } from "@/app/providers/language-provider";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  DEFAULT_VALUES,
  INBOX_SELECT_VALUE,
  type TaskEditFormValues
} from "./task-edit.constants";
import { createTaskEditDraftSignature } from "./task-edit.helpers";
import { getTaskEditSelectedProject } from "./task-edit.selectors";

export function useTaskEditForm() {
  const copy = useCopy();
  const { language } = useLanguage();
  const { actions, derived, state } = useMindFlowApp();
  
  const task = derived.editingTask;
  const taskId = task?.id ?? "";

  const [draft, setDraft] = useState<TaskEditFormValues>(DEFAULT_VALUES);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  const lastSyncedSignatureRef = useRef("");
  const hydratedTaskIdRef = useRef<string | null>(null);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeProjects = useMemo(
    () => [...derived.favoriteProjects, ...derived.regularProjects],
    [derived.favoriteProjects, derived.regularProjects]
  );

  useEffect(() => {
    if (task == null) {
      hydratedTaskIdRef.current = null;
      if (autosaveTimeoutRef.current != null) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
      setIsDraftReady(false);
      setDraft(DEFAULT_VALUES);
      setTitleError(null);
      return;
    }

    if (hydratedTaskIdRef.current === task.id) {
      return;
    }

    setIsDraftReady(false);

    const nextDraft: TaskEditFormValues = {
      title: task.title,
      description: task.description ?? "",
      projectId: task.projectId ?? INBOX_SELECT_VALUE,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
      status: task.status
    };

    hydratedTaskIdRef.current = task.id;
    lastSyncedSignatureRef.current = createTaskEditDraftSignature(nextDraft);
    setDraft(nextDraft);
    setTitleError(null);
    setIsDraftReady(true);
  }, [task]);

  const buildSavePayload = useCallback(
    (values: TaskEditFormValues = draft) => {
      const normalizedTitle = values.title.trim();

      if (!normalizedTitle) {
        setTitleError(copy.task.titleRequired);
        return null;
      }

      setTitleError(null);

      return {
        taskId,
        title: normalizedTitle,
        description: values.description.trim()
          ? values.description.trim()
          : null,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate || null,
        projectId:
          values.projectId === INBOX_SELECT_VALUE ? null : values.projectId
      };
    },
    [copy, draft, taskId]
  );

  useEffect(() => {
    if (
      task == null ||
      !isDraftReady ||
      hydratedTaskIdRef.current !== task.id
    ) {
      return;
    }

    const draftSignature = createTaskEditDraftSignature(draft);
    if (draftSignature === lastSyncedSignatureRef.current) {
      return;
    }

    const payload = buildSavePayload(draft);
    if (payload == null) {
      return;
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      void actions
        .saveTaskEdit(payload, {
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
  }, [actions, buildSavePayload, draft, isDraftReady, task]);

  const flushAutosave = useCallback(async () => {
    const draftSignature = createTaskEditDraftSignature(draft);
    if (!isDraftReady || draftSignature === lastSyncedSignatureRef.current) {
      return true;
    }

    const payload = buildSavePayload(draft);
    if (payload == null) {
      return false;
    }

    const saved = await actions.saveTaskEdit(payload, {
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
    actions.closeTaskEdit();
  }, [actions, flushAutosave]);

  const selectedProject = getTaskEditSelectedProject(
    activeProjects,
    draft.projectId
  );
  const dueDateLabel = draft.dueDate
    ? formatDisplayDate(draft.dueDate, language)
    : copy.task.noDueDate;

  return {
    activeProjects,
    description: draft.description,
    dueDateLabel,
    dueDate: draft.dueDate,
    handleArchiveTask() {
      void actions.archiveTask(taskId);
    },
    handleClose,
    handleDeleteTask() {
      void actions.deleteTask(taskId);
    },
    priority: draft.priority,
    projectId: draft.projectId,
    selectedProject,
    setDescription(nextDescription: string) {
      setDraft((current) => ({ ...current, description: nextDescription }));
    },
    setDueDate(nextDueDate: string) {
      setDraft((current) => ({ ...current, dueDate: nextDueDate }));
    },
    setPriority(nextPriority: TaskPriority) {
      setDraft((current) => ({ ...current, priority: nextPriority }));
    },
    setProjectId(nextProjectId: string) {
      setDraft((current) => ({ ...current, projectId: nextProjectId }));
    },
    setStatus(nextStatus: TaskStatus) {
      setDraft((current) => ({ ...current, status: nextStatus }));
    },
    setTitle(nextTitle: string) {
      setDraft((current) => ({ ...current, title: nextTitle }));
      if (titleError != null) {
        setTitleError(null);
      }
    },
    state,
    status: draft.status,
    task,
    title: draft.title,
    titleError
  };
}
