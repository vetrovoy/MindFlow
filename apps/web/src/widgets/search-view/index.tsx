import { useMemo, useState } from "react";

import { searchEntities } from "@mindflow/domain";

import { useCopy } from "@/app/providers/language-provider";
import { TaskListEntity } from "@/entities/task-list";
import { useAppState } from "@/shared/model/app-store-provider";
import { sortProjects, sortTasks } from "@/shared/model/task-store.helpers";
import { Icon, ProjectCard } from "@/shared/ui";
import { Body, MetaText } from "@/shared/ui/typography";
import { SectionTitle, StateCard, SurfaceCard, TextField } from "@/shared/ui/primitives";
import { SearchSortControl, type SearchSortOption } from "./ui/search-sort-control";
import styles from "./index.module.css";

export function SearchViewWidget() {
  const copy = useCopy();
  const { actions, derived, state } = useAppState();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SearchSortOption>("relevance");

  const results = useMemo(
    () => {
      const nextResults = searchEntities(state.tasks, state.projects, query);
      const sortedTasks = sortTasks(nextResults.tasks);
      const sortedProjects = sortProjects(nextResults.projects);

      if (sortBy === "date") {
        sortedTasks.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      }

      return {
        tasks: sortedTasks,
        projects: sortedProjects
      };
    },
    [query, state.projects, state.tasks, sortBy]
  );
  const normalizedQuery = query.trim();
  const projectSectionsById = useMemo(
    () => new Map(derived.projectSections.map((section) => [section.project.id, section])),
    [derived.projectSections]
  );
  const hasResults = results.tasks.length > 0 || results.projects.length > 0;

  return (
    <div className={styles.root}>
      <SurfaceCard>
        <SectionTitle
          action={
            <SearchSortControl sortBy={sortBy} onSortChange={setSortBy} />
          }
          title={copy.search.title}
        />
        <label className={styles.fieldShell}>
          <span className={styles.fieldIcon}>
            <Icon decorative name="search" size={18} tone="muted" />
          </span>
          <TextField
            autoFocus
            autoComplete="off"
            className={styles.field}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={copy.search.fieldPlaceholder}
            type="search"
            value={query}
          />
        </label>
        <div className={styles.content}>
          {normalizedQuery.length === 0 ? (
            <StateCard
              description={copy.search.idleDescription}
              title={copy.search.idleTitle}
              variant="empty"
            />
          ) : !hasResults ? (
            <StateCard
              description={copy.search.emptyDescription}
              title={copy.search.emptyTitle}
              variant="empty"
            />
          ) : (
            <div className={styles.groups}>
              {results.tasks.length > 0 ? (
                <section className={styles.group}>
                  <div className={styles.groupHeader}>
                    <MetaText as="strong">{copy.search.tasksTitle}</MetaText>
                    <Body className={styles.groupMeta}>{results.tasks.length}</Body>
                  </div>
                  <TaskListEntity
                    onOpenTask={actions.openTaskEdit}
                    onToggleDone={(taskId) => {
                      void actions.toggleTask(taskId);
                    }}
                    tasks={results.tasks}
                  />
                </section>
              ) : null}
              {results.projects.length > 0 ? (
                <section className={styles.group}>
                  <div className={styles.groupHeader}>
                    <MetaText as="strong">{copy.search.projectsTitle}</MetaText>
                    <Body className={styles.groupMeta}>{results.projects.length}</Body>
                  </div>
                  <div className={styles.projectGrid}>
                    {results.projects.map((project) => {
                      const section = projectSectionsById.get(project.id);

                      return (
                        <ProjectCard
                          key={project.id}
                          onOpenProject={actions.openProjectEdit}
                          progress={section?.progress ?? { done: 0, total: 0 }}
                          project={project}
                          tasks={section?.tasks ?? []}
                        />
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
