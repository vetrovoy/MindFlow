import { useMemo } from "react";

import { useCopy } from "@/app/providers/language-provider";
import { useAppState } from "@/shared/model/app-store-provider";
import { Body, MetaText } from "@/shared/ui/typography";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import { ArchivedProjectRow, ArchivedTaskRow } from "./ui/archived-row";
import styles from "./index.module.css";

export function ArchiveViewWidget() {
  const copy = useCopy();
  const { actions, state } = useAppState();
  const projectById = useMemo(
    () => new Map(state.projects.map((project) => [project.id, project])),
    [state.projects]
  );
  const taskCountByProjectId = useMemo(() => {
    const counts = new Map<string, number>();

    for (const task of state.tasks) {
      if (task.projectId == null) {
        continue;
      }

      counts.set(task.projectId, (counts.get(task.projectId) ?? 0) + 1);
    }

    return counts;
  }, [state.tasks]);
  const archivedTasks = useMemo(
    () =>
      state.tasks
        .filter((task) => task.archivedAt != null)
        .sort((left, right) => (right.archivedAt ?? "").localeCompare(left.archivedAt ?? "")),
    [state.tasks]
  );
  const archivedProjects = useMemo(
    () =>
      state.projects
        .filter((project) => project.archivedAt != null)
        .sort((left, right) => (right.archivedAt ?? "").localeCompare(left.archivedAt ?? "")),
    [state.projects]
  );

  return (
    <div className={styles.root}>
      <SurfaceCard>
        <SectionTitle title={copy.archive.title} />
        {archivedTasks.length === 0 && archivedProjects.length === 0 ? (
          <StateCard
            description={copy.archive.emptyDescription}
            title={copy.archive.emptyTitle}
            variant="empty"
          />
        ) : (
          <div className={styles.groups}>
            {archivedTasks.length > 0 ? (
              <section className={styles.group}>
                <div className={styles.groupHeader}>
                  <MetaText as="strong">{copy.archive.tasksTitle}</MetaText>
                  <Body className={styles.groupMeta}>{archivedTasks.length}</Body>
                </div>
                <div className={styles.rows}>
                  {archivedTasks.map((task) => (
                    <ArchivedTaskRow
                      key={task.id}
                      onRestore={(taskId) => {
                        void actions.restoreTask(taskId);
                      }}
                      project={task.projectId == null ? null : projectById.get(task.projectId) ?? null}
                      task={task}
                    />
                  ))}
                </div>
              </section>
            ) : null}
            {archivedProjects.length > 0 ? (
              <section className={styles.group}>
                <div className={styles.groupHeader}>
                  <MetaText as="strong">{copy.archive.projectsTitle}</MetaText>
                  <Body className={styles.groupMeta}>{archivedProjects.length}</Body>
                </div>
                <div className={styles.rows}>
                  {archivedProjects.map((project) => (
                    <ArchivedProjectRow
                      key={project.id}
                      onRestore={(projectId) => {
                        void actions.restoreProject(projectId);
                      }}
                      project={project}
                      taskCount={taskCountByProjectId.get(project.id) ?? 0}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
