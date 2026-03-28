import * as Toast from "@radix-ui/react-toast";

import { useCopy } from "@/app/providers/language-provider";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { Icon, MetaText, Title } from "@/shared/ui";
import styles from "./index.module.css";

export function SystemStatusWidget() {
  const copy = useCopy();
  const { actions, state } = useMindFlowApp();

  if (!state.isSaving && state.error == null && state.toast == null) {
    return null;
  }

  return (
    <Toast.Provider label={copy.systemStatus.notificationsLabel}>
      <Toast.Root
        className={styles.card}
        duration={Number.POSITIVE_INFINITY}
        open={state.isSaving}
      >
        <div className={styles.left}>
          <span aria-hidden="true" className={styles.dot} />
          <div className={styles.content}>
            <Toast.Title asChild>
              <Title as="strong" className={styles.text}>
                {copy.common.loadingTitle}
              </Title>
            </Toast.Title>
          </div>
        </div>
        <Toast.Description asChild>
          <MetaText className={styles.meta}>{copy.common.loadingMeta}</MetaText>
        </Toast.Description>
      </Toast.Root>

      <Toast.Root
        className={styles.card}
        duration={2600}
        onOpenChange={(open) => {
          if (!open) {
            actions.dismissToast();
          }
        }}
        open={state.toast != null}
      >
        <div className={styles.left}>
          <Icon className={styles.successIcon} name="check" size={14} tone="success" />
          <div className={styles.content}>
            <Toast.Title asChild>
              <Title as="strong" className={styles.text}>
                {state.toast?.title ?? ""}
              </Title>
            </Toast.Title>
            {state.toast?.description ? (
              <Toast.Description asChild>
                <span className={styles.description}>{state.toast.description}</span>
              </Toast.Description>
            ) : null}
          </div>
        </div>
        <MetaText className={styles.metaSuccess}>{copy.common.successMeta}</MetaText>
      </Toast.Root>

      <Toast.Root
        className={styles.card}
        duration={Number.POSITIVE_INFINITY}
        onOpenChange={(open) => {
          if (!open) {
            actions.clearError();
          }
        }}
        open={state.error != null}
      >
        <div className={styles.left}>
          <Icon className={styles.errorIcon} name="close" size={14} tone="alert" />
          <div className={styles.content}>
            <Toast.Title asChild>
              <Title as="strong" className={styles.text}>
                {copy.systemStatus.saveErrorTitle}
              </Title>
            </Toast.Title>
            {state.error == null ? null : (
              <Toast.Description asChild>
                <span className={styles.description}>{state.error}</span>
              </Toast.Description>
            )}
          </div>
        </div>
        <MetaText className={styles.metaError}>{copy.common.errorMeta}</MetaText>
      </Toast.Root>

      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
}
