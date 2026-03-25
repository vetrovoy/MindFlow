import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { Icon, MetaText, Title } from "@/shared/ui";
import styles from "./index.module.css";

export function SystemStatusWidget() {
  const { state } = useMindFlowApp();

  if (!state.isSaving && state.error == null && state.toast == null) {
    return null;
  }

  return (
    <div aria-live="polite" className={styles.stack}>
      {state.isSaving ? (
        <section className={styles.card}>
          <div className={styles.left}>
            <span aria-hidden="true" className={styles.dot} />
            <Title as="strong" className={styles.text}>
              Сохранение...
            </Title>
          </div>
          <MetaText className={styles.meta}>ЗАГРУЗКА</MetaText>
        </section>
      ) : null}

      {state.toast == null ? null : (
        <section className={styles.card}>
          <div className={styles.left}>
            <Icon className={styles.successIcon} name="check" size={14} tone="success" />
            <Title as="strong" className={styles.text}>
              {state.toast.title}
            </Title>
          </div>
          <MetaText className={styles.metaSuccess}>УСПЕХ</MetaText>
        </section>
      )}

      {state.error == null ? null : (
        <section className={styles.card}>
          <div className={styles.left}>
            <Icon className={styles.errorIcon} name="priority-high" size={14} tone="alert" />
            <Title as="strong" className={styles.text}>
              Ошибка сохранения
            </Title>
          </div>
          <MetaText className={styles.metaError}>ОШИБКА</MetaText>
        </section>
      )}
    </div>
  );
}
