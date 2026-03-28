import { useMemo } from "react";

import { useCopy } from "@/app/providers/language-provider";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { Display, MetaText } from "@/shared/ui";
import styles from "./app-stats.module.css";

export function AppStats() {
  const copy = useCopy();
  const { derived } = useMindFlowApp();

  const activeTasksCount = useMemo(
    () =>
      derived.inboxTasks.filter((task) => task.status !== "done").length +
      derived.projectSections.reduce(
        (total, section) =>
          total + section.tasks.filter((task) => task.status !== "done").length,
        0
      ),
    [derived.inboxTasks, derived.projectSections]
  );

  const tasksInInboxCount = useMemo(
    () => derived.inboxTasks.filter((task) => task.status !== "done").length,
    [derived.inboxTasks]
  );

  return (
    <div className={styles.stats}>
      <section className={styles.statCard}>
        <MetaText className={styles.statLabel}>{copy.app.inboxStat}</MetaText>
        <Display as="strong" className={styles.statValueAccent}>
          {tasksInInboxCount}
        </Display>
      </section>
      <section className={styles.statCard}>
        <MetaText className={styles.statLabel}>{copy.app.activeStat}</MetaText>
        <Display as="strong" className={styles.statValue}>
          {activeTasksCount}
        </Display>
      </section>
    </div>
  );
}
