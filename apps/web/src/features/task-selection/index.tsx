import { useState } from "react";

import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import { Body, Title } from "../../shared/ui";
import { ActionButton, SelectField, TextField } from "../../shared/ui/primitives";
import styles from "./index.module.css";

export function TaskSelectionFeature() {
  const { actions, derived, state } = useMindFlowApp();
  const [projectId, setProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const selectedCount = state.selectedInboxTaskIds.length;

  if (selectedCount === 0) {
    return null;
  }

  return (
    <section className={styles.panel}>
      <Title as="strong" className={styles.title}>
        Выбрано {selectedCount} {selectedCount === 1 ? "задача" : selectedCount < 5 ? "задачи" : "задач"} из Входящих
      </Title>
      <Body className={styles.description}>
        Перенесите выбор в существующий список или создайте новый, не теряя порядок.
      </Body>
      <div className={styles.content}>
        <SelectField
          onChange={(event) => {
            setProjectId(event.target.value);
          }}
          value={projectId}
        >
          <option value="">Выберите существующий список</option>
          {derived.favoriteProjects.concat(derived.regularProjects).map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </SelectField>
        <div className={styles.actions}>
          <ActionButton
            disabled={!projectId || state.isSaving}
            onClick={() => {
              void actions.moveSelectedInboxTasks({ projectId });
            }}
            variant="primary"
          >
            Перенести в список
          </ActionButton>
          <ActionButton
            onClick={() => {
              actions.clearInboxSelection();
            }}
            variant="secondary"
          >
            Очистить выбор
          </ActionButton>
        </div>
        <TextField
          onChange={(event) => {
            setNewProjectName(event.target.value);
          }}
          placeholder="Или создайте новый список из этого выбора"
          value={newProjectName}
        />
        <div className={styles.createRow}>
          <ActionButton
            disabled={!newProjectName.trim() || state.isSaving}
            onClick={() => {
              void actions.moveSelectedInboxTasks({ projectName: newProjectName });
              setNewProjectName("");
              setProjectId("");
            }}
          >
            Создать и перенести
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
