import { useState } from "react";

import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import { Heading, Icon } from "../../shared/ui";
import { ActionButton } from "../../shared/ui/primitives";
import styles from "./index.module.css";

export function ProjectCreateFeature() {
  const { actions, state } = useMindFlowApp();
  const [value, setValue] = useState("");

  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        const created = await actions.createProject(value);
        if (created) {
          setValue("");
        }
      }}
    >
      <div className={styles.card}>
        <Heading as="h3" className={styles.title}>
          Создать список
        </Heading>
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
              placeholder="Создайте новый список проекта..."
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
