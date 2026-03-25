import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import { Body, Heading, MetaText, Modal, ModalHeader, Title } from "../../shared/ui";
import { ActionButton } from "../../shared/ui/primitives";
import styles from "./index.module.css";

export function TaskEditFeature() {
  const { actions, derived } = useMindFlowApp();
  const task = derived.editingTask;

  if (task == null) {
    return null;
  }

  return (
    <Modal
      contentClassName={styles.drawerContent}
      onClose={() => {
        actions.closeTaskEdit();
      }}
      open={task != null}
    >
      <ModalHeader
        description={
          <Body className={styles.description}>
            Скоро здесь будет полноценный редактор задачи. Пока оставляем аккуратную заглушку, чтобы спокойно собрать финальный UX.
          </Body>
        }
        onClose={() => {
          actions.closeTaskEdit();
        }}
        title={
          <Heading as="strong" className={styles.title}>
            Заглушка редактирования задачи
          </Heading>
        }
      />
      <section className={styles.snapshot}>
        <MetaText className={styles.label}>Текущая задача</MetaText>
        <Title as="strong" className={styles.snapshotTitle}>
          {task.title}
        </Title>
        <Body className={styles.snapshotText}>
          Реальные поля формы временно скрыты. На этом месте появится новая версия редактора, когда закрепим структуру взаимодействия.
        </Body>
      </section>
      <div className={styles.footer}>
        <ActionButton
          onClick={() => {
            actions.closeTaskEdit();
          }}
          variant="secondary"
        >
          Закрыть
        </ActionButton>
      </div>
    </Modal>
  );
}
