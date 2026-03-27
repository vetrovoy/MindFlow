import type { TaskPriority, TaskStatus } from "@mindflow/domain";
import { useEffect, useMemo, useState } from "react";

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
  PRIORITY_OPTIONS,
  STATUS_OPTIONS
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
    setDate(resolvedPreferredDate);
  }, [resolvedPreferredDate, open]);

  const activeProjects = useMemo(
    () => [...derived.favoriteProjects, ...derived.regularProjects],
    [derived.favoriteProjects, derived.regularProjects]
  );

  const dateLabel = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
      })
    : "";
  const selectedProject =
    activeProjects.find((project) => project.id === projectId) ?? null;
  const projectLabel = selectedProject?.name ?? "Входящие";
  const priorityLabel = getTaskPriorityLabel(priority);
  const statusLabel = getTaskStatusLabel(status);

  async function handleCreate() {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setTitleError("Добавьте название задачи.");
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
            <MetaText>Создать задачу</MetaText>
          </div>
          <IconButton
            ariaLabel="Закрыть создание задачи"
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
            placeholder="Что именно нужно сделать?"
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
            triggerLabel="Изменить список"
          >
            <div className={styles.popoverBody}>
              <SelectField
                className={styles.select}
                contentClassName={styles.selectContent}
                id="task-create-project"
                onValueChange={setProjectId}
                options={[
                  { value: INBOX_SELECT_VALUE, label: "Входящие" },
                  ...activeProjects.map((project) => ({
                    value: project.id,
                    label: project.name
                  }))
                ]}
                placeholder="Выберите список"
                value={projectId}
              />
            </div>
          </TaskDockPopover>

          <TaskDockPopover
            active={Boolean(date)}
            iconName="today"
            triggerLabel="Изменить срок"
          >
            <div className={styles.popoverBody}>
              <DatePickerField
                id="task-create-date"
                onChange={setDate}
                placeholder="Выберите дату"
                value={date}
              />
            </div>
          </TaskDockPopover>

          <TaskDockPopover
            active={priority !== "medium"}
            iconName={getTaskPriorityIconName(priority)}
            triggerLabel={`Приоритет: ${priorityLabel}`}
          >
            <div className={styles.popoverBody}>
              <RadioCardGroup
                ariaLabel="Приоритет новой задачи"
                className={styles.compactRadioGroup}
                onValueChange={(value) => {
                  setPriority(value as TaskPriority);
                }}
                options={PRIORITY_OPTIONS}
                value={priority}
              />
            </div>
          </TaskDockPopover>

          <TaskDockPopover
            active={status !== "todo"}
            iconName={getTaskStatusIconName(status)}
            triggerLabel={`Статус: ${statusLabel}`}
          >
            <div className={styles.popoverBody}>
              <RadioCardGroup
                ariaLabel="Статус новой задачи"
                className={styles.compactRadioGroup}
                onValueChange={(value) => {
                  setStatus(value as TaskStatus);
                }}
                options={STATUS_OPTIONS}
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
            Сохранить
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
