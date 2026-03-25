import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  DEFAULT_VALUES,
  INBOX_SELECT_VALUE,
  type TaskEditFormValues
} from "./task-edit.constants";

function createDraftSignature(values: TaskEditFormValues) {
  return JSON.stringify(values);
}

export function useTaskEditForm() {
  const { actions, derived, state } = useMindFlowApp();
  const task = derived.editingTask;
  const activeProjects = useMemo(
    () => [...derived.favoriteProjects, ...derived.regularProjects],
    [derived.favoriteProjects, derived.regularProjects]
  );
  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    reset,
    setError,
    setValue
  } = useForm<TaskEditFormValues>({
    defaultValues: DEFAULT_VALUES
  });
  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "description" }) ?? "";
  const projectId = useWatch({ control, name: "projectId" }) ?? INBOX_SELECT_VALUE;
  const dueDate = useWatch({ control, name: "dueDate" }) ?? "";
  const priority = useWatch({ control, name: "priority" }) ?? "medium";
  const status = useWatch({ control, name: "status" }) ?? "todo";
  const lastSyncedSignatureRef = useRef("");
  const hydratedTaskIdRef = useRef<string | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);
  const taskId = task?.id ?? "";

  const currentDraft = useMemo<TaskEditFormValues>(
    () => ({
      title,
      description,
      projectId,
      dueDate,
      priority,
      status
    }),
    [description, dueDate, priority, projectId, status, title]
  );

  useEffect(() => {
    if (task == null) {
      hydratedTaskIdRef.current = null;
      if (autosaveTimeoutRef.current != null) {
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
      clearErrors();
      reset(DEFAULT_VALUES);
      return;
    }

    if (hydratedTaskIdRef.current === task.id) {
      return;
    }

    const nextValues: TaskEditFormValues = {
      title: task.title,
      description: task.description ?? "",
      projectId: task.projectId ?? INBOX_SELECT_VALUE,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
      status: task.status
    };

    reset(nextValues);
    clearErrors();
    hydratedTaskIdRef.current = task.id;
    lastSyncedSignatureRef.current = createDraftSignature(nextValues);
  }, [clearErrors, reset, task]);

  const buildSavePayload = useCallback(
    (values: TaskEditFormValues = getValues()) => {
      const normalizedTitle = values.title.trim();

      if (!normalizedTitle) {
        setError("title", {
          type: "required",
          message: "Добавьте короткое название задачи, чтобы сохранить изменения."
        });
        return null;
      }

      clearErrors("title");

      return {
        taskId,
        title: normalizedTitle,
        description: values.description.trim() ? values.description.trim() : null,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate || null,
        projectId: values.projectId === INBOX_SELECT_VALUE ? null : values.projectId
      };
    },
    [clearErrors, getValues, setError, taskId]
  );

  useEffect(() => {
    if (task == null) {
      return;
    }

    if (hydratedTaskIdRef.current !== task.id) {
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
        window.clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [actions, buildSavePayload, currentDraft, task]);

  const flushAutosave = useCallback(async () => {
    const draftSignature = createDraftSignature(getValues());
    if (draftSignature === lastSyncedSignatureRef.current) {
      return true;
    }

    const payload = buildSavePayload();
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
  }, [actions, buildSavePayload, getValues]);

  const handleClose = useCallback(async () => {
    if (autosaveTimeoutRef.current != null) {
      window.clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }

    await flushAutosave();
    actions.closeTaskEdit();
  }, [actions, flushAutosave]);

  const selectedProject = activeProjects.find((project) => project.id === projectId) ?? null;
  const dueDateLabel = dueDate
    ? new Date(`${dueDate}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "Без срока";

  return {
    activeProjects,
    clearErrors,
    control,
    dueDateLabel,
    errors,
    handleArchiveTask() {
      void actions.archiveTask(taskId);
    },
    handleClose,
    handleDeleteTask() {
      void actions.deleteTask(taskId);
    },
    priority,
    selectedProject,
    setPriority(nextPriority: TaskPriority) {
      setValue("priority", nextPriority, { shouldDirty: true });
    },
    setStatus(nextStatus: TaskStatus) {
      setValue("status", nextStatus, { shouldDirty: true });
    },
    state,
    status,
    task
  };
}
