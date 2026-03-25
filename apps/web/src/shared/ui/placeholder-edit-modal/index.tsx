import type { ReactNode } from "react";

import { Body, Heading, MetaText, Modal, ModalHeader, Title } from "..";
import { ActionButton } from "@/shared/ui/primitives";
import styles from "./index.module.css";

interface PlaceholderEditModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  label: string;
  entityTitle: string;
  entityDescription: string;
  footerActionLabel?: string;
  titleContent?: ReactNode;
}

export function PlaceholderEditModal({
  description,
  entityDescription,
  entityTitle,
  footerActionLabel = "Закрыть",
  label,
  onClose,
  open,
  title,
  titleContent
}: PlaceholderEditModalProps) {
  if (!open) {
    return null;
  }

  return (
    <Modal contentClassName={styles.drawerContent} onClose={onClose} open>
      <ModalHeader
        description={<Body className={styles.description}>{description}</Body>}
        onClose={onClose}
        title={
          titleContent ?? (
            <Heading as="strong" className={styles.title}>
              {title}
            </Heading>
          )
        }
      />
      <section className={styles.snapshot}>
        <MetaText className={styles.label}>{label}</MetaText>
        <Title as="strong" className={styles.snapshotTitle}>
          {entityTitle}
        </Title>
        <Body className={styles.snapshotText}>{entityDescription}</Body>
      </section>
      <div className={styles.footer}>
        <ActionButton onClick={onClose} variant="secondary">
          {footerActionLabel}
        </ActionButton>
      </div>
    </Modal>
  );
}
