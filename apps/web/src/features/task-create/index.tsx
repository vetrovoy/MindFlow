import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import { formatDisplayDate } from "@mindflow/copy";
import { useEffect, useMemo, useState } from "react";

import { useCopy, useLanguage } from "@/app/providers/language-provider";
import { getTodayDateKey } from "@/shared/lib/date";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import {
  ActionButton,
  DatePickerField,
  IconButton,
  MetaText,
  Modal,
  RadioCardGroup,
  SelectField,
  TextField
} from "@/shared/ui";
import {
  INBOX_SELECT_VALUE,
} from "@/features/task-edit/model/task-edit.constants";
import {
  getTaskPriorityIconName,
  getTaskPriorityLabel,
  getTaskStatusIconName,
  getTaskStatusLabel
} from "@/features/task-edit/model/task-edit.view";
import { TaskDockPopover } from "@/features/task-edit/ui/task-dock-popover";
import styles from "./index.module.css";

interface TaskCreateFeatureProps {
  open: boolean;
  onClose: () => void;
  preferredDate?: Date | string;
}

function resolvePreferredDate(preferredDate?: Date | string) {
  if (preferredDate == null) {
    return "";
  }

  if (typeof preferredDate === "string") {
    return preferredDate;
  }

  return getTodayDateKey(preferredDate);
}

export function TaskCreateFeature({
  onClose,
  open,
  preferredDate
}: TaskCreateFeatureProps) {
  const copy = useCopy();
  const { language } = useLanguage();
  const { actions, derived } = useMindFlowApp();
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [projectId, setProjectId] = useState(INBOX_SELECT_VALUE);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const resolvedPreferredDate = useMemo(
    () => resolvePreferredDate(preferredDate),
    [preferredDate]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle("");
    setTitleError(null);
    setDate(resolvedPreferredDate);
    setProjectId(INBOX_SELECT_VALUE);
    setPriority("medium");
    setStatus("todo");
  }, [resolvedPreferredDate, open]);

  const activeProjects = useMemo(
    () => [...derived.favoriteProjects, ...derived.regularProjects],
    [derived.favoriteProjects, derived.regularProjects]
  );

  const dateLabel = date ? formatDisplayDate(date, language) : "";
  const selectedProject =
    activeProjects.find((project) => project.id === projectId) ?? null;
  const projectLabel = selectedProject?.name ?? copy.task.inbox;
  const priorityLabel = getTaskPriorityLabel(copy, priority);
  const statusLabel = getTaskStatusLabel(copy, status);
  const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
    { value: "low", label: copy.priority.low },
    { value: "medium", label: copy.priority.medium },
    { value: "high", label: copy.priority.high }
  ];
  const statusOptions: Array<{ value: TaskStatus; label: string }> = [
    { value: "todo", label: copy.status.todo },
    { value: "done", label: copy.status.done }
  ];

  async function handleCreate() {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setTitleError(copy.task.titleRequired);
      return;
    }

    const created = await actions.addInboxTask({
      title: normalizedTitle,
      dueDate: date || null,
      projectId: projectId === INBOX_SELECT_VALUE ? null : projectId,
      priority,
      status
    });

    if (!created) {
      return;
    }

    setTitle("");
    setDate("");
    setProjectId(INBOX_SELECT_VALUE);
    setPriority("medium");
    setStatus("todo");
    setTitleError(null);
    onClose();
  }

  return (
    <Modal
      contentClassName={styles.modalContent}
      onClose={onClose}
      open={open}
      showHandle={false}
    >
      <div className={styles.root}>
        <div className={styles.headerBar}>
          <div className={styles.headerMeta}>
            <MetaText>{copy.task.createTitle}</MetaText>
          </div>
          <IconButton
            ariaLabel={copy.task.createCloseAriaLabel}
            icon="close"
            onClick={onClose}
            variant="secondary"
          />
        </div>

        <div className={styles.hero}>
          <TextField
            autoFocus
            className={styles.titleField}
            id="task-create-title"
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError != null) {
                setTitleError(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleCreate();
              }
            }}
            placeholder={copy.task.titlePlaceholder}
            value={title}
          />
          {titleError == null ? null : (
            <p className={styles.validationMessage}>{titleError}</p>
          )}
          <div className={styles.metaInline}>
            <MetaText className={styles.metaChip}>{projectLabel}</MetaText>
            {dateLabel ? (
              <MetaText className={styles.metaChip}>{dateLabel}</MetaText>
            ) : null}
            <MetaText className={styles.metaChip}>{priorityLabel}</MetaText>
            <MetaText className={styles.metaChip}>{statusLabel}</MetaText>
          </div>
        </div>

        <div className={styles.toolbar}>
          <TaskDockPopover
            active={projectId !== INBOX_SELECT_VALUE}
            iconName="nav-lists"
            triggerLabel={copy.task.changeProjectTrigger}
          >
            <div className={styles.popoverBody}>
              <SelectField
                className={styles.select}
                contentClassName={styles.selectContent}
                id="task-create-project"
                onValueChange={setProjectId}
                options={[
                  { value: INBOX_SELECT_VALUE, label: copy.task.inbox },
                  ...activeProjects.map((project) => ({
                    value: project.id,
                    label: project.name
                  }))
                ]}
                placeholder={copy.editor.selectListPlaceholder}
                value={projectId}
              />
            </div>
          </TaskDockPopover>

          <TaskDockPopover
            active={Boolean(date)}
            iconName="today"
            triggerLabel={copy.task.changeDueDateTrigger}
          >
            <div className={styles.popoverBody}>
              <DatePickerField
                id="task-create-date"
                onChange={setDate}
                placeholder={copy.editor.selectDatePlaceholder}
                value={date}
              />
            </div>
          </TaskDockPopover>

          <TaskDockPopover
            active={priority !== "medium"}
            iconName={getTaskPriorityIconName(priority)}
            triggerLabel={`${copy.task.priorityAriaLabel}: ${priorityLabel}`}
          >
            <div className={styles.popoverBody}>
              <RadioCardGroup
                ariaLabel={copy.task.priorityAriaLabel}
                className={styles.compactRadioGroup}
                onValueChange={(value) => {
                  setPriority(value as TaskPriority);
                }}
                options={priorityOptions}
                value={priority}
              />
            </div>
          </TaskDockPopover>

          <TaskDockPopover
            active={status !== "todo"}
            iconName={getTaskStatusIconName(status)}
            triggerLabel={`${copy.task.statusAriaLabel}: ${statusLabel}`}
          >
            <div className={styles.popoverBody}>
              <RadioCardGroup
                ariaLabel={copy.task.statusAriaLabel}
                className={styles.compactRadioGroup}
                onValueChange={(value) => {
                  setStatus(value as TaskStatus);
                }}
                options={statusOptions}
                value={status}
              />
            </div>
          </TaskDockPopover>

          <ActionButton
            className={styles.saveButton}
            onClick={() => {
              void handleCreate();
            }}
          >
            {copy.common.save}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
