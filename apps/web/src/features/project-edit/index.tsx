import { Body, Heading, MetaText, Modal, ModalHeader, Title } from "../../shared/ui";
import { ActionButton } from "../../shared/ui/primitives";
import { useMindFlowApp } from "../../shared/model/mindflow-provider";
import styles from "./index.module.css";

export function ProjectEditFeature() {
  const { actions, derived } = useMindFlowApp();
  const project = derived.editingProject;

  if (project == null) {
    return null;
  }

  return (
    <Modal
      contentClassName={styles.drawerContent}
      onClose={() => {
        actions.closeProjectEdit();
      }}
      open
    >
      <ModalHeader
        description={
          <Body className={styles.description}>
            Это временная заглушка списка. Полноценное редактирование проекта добавим следующим отдельным проходом.
          </Body>
        }
        onClose={() => {
          actions.closeProjectEdit();
        }}
        title={
          <Heading as="strong" className={styles.title}>
            Заглушка редактирования списка
          </Heading>
        }
      />
      <section className={styles.snapshot}>
        <MetaText className={styles.label}>Текущий список</MetaText>
        <Title as="strong" className={styles.snapshotTitle}>
          {project.name}
        </Title>
        <Body className={styles.snapshotText}>
          Клик по карточке списка теперь открывает эту заглушку. Это даёт нам чистую точку входа для будущего project editor.
        </Body>
      </section>
      <div className={styles.footer}>
        <ActionButton
          onClick={() => {
            actions.closeProjectEdit();
          }}
          variant="secondary"
        >
          Закрыть
        </ActionButton>
      </div>
    </Modal>
  );
}
