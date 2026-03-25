import { useState } from "react";

import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import { Body, Heading, Icon } from "../../shared/ui";
import { ActionButton } from "../../shared/ui/primitives";
import styles from "./index.module.css";

export function QuickAddFeature() {
  const { actions, state } = useMindFlowApp();
  const [value, setValue] = useState("");

  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        const created = await actions.addInboxTask(value);
        if (created) {
          setValue("");
        }
      }}
    >
      <div className={styles.card}>
        <Heading as="h3" className={styles.title}>
          Быстрый захват задач
        </Heading>
        <Body className={styles.description}>
          Добавляйте задачи без приоритета в течение дня. Разбор и планирование позже.
        </Body>
        <div className={styles.inputShell}>
          <label className={styles.inputWrap}>
            <span className={styles.inputLead}>
              <Icon name="add" size={14} tone="muted" />
            </span>
            <input
              className={styles.input}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              placeholder="Новая задача..."
              value={value}
            />
          </label>
          <ActionButton
            className={styles.submitButton}
            disabled={!value.trim() || state.isSaving}
            type="submit"
          >
            Создать
          </ActionButton>
        </div>
      </div>
    </form>
  );
}
