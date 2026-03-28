import { useCopy } from "@/app/providers/language-provider";
import { ProjectTaskReorderFeature } from "@/features/project-task-reorder";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { ProjectCard } from "@/shared/ui";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import styles from "./index.module.css";

export function ListsViewWidget() {
  const copy = useCopy();
  const { actions, derived } = useMindFlowApp();

  return (
    <div className={styles.root}>
      {derived.favoriteProjects.length > 0 ? (
        <SurfaceCard>
          <SectionTitle
            subtitle={copy.lists.favoritesSubtitle}
            title={copy.lists.favoritesTitle}
          />
          <div className={styles.sections}>
            {derived.projectSections
              .filter((section) => section.project.isFavorite)
              .map((section) => (
                <div key={section.project.id} className={styles.section}>
                  <ProjectCard
                    onOpenProject={actions.openProjectEdit}
                    progress={section.progress}
                    project={section.project}
                    tasks={section.tasks}
                  />
                  {section.tasks.length === 0 ? (
                    <StateCard
                      description={copy.lists.favoriteEmptyDescription}
                      title={copy.common.empty}
                      variant="empty"
                    />
                  ) : (
                    <ProjectTaskReorderFeature
                      projectId={section.project.id}
                      tasks={section.tasks}
                    />
                  )}
                </div>
              ))}
          </div>
        </SurfaceCard>
      ) : null}
      <SurfaceCard>
        <SectionTitle title={copy.lists.allTitle} />
        {derived.regularProjects.length === 0 ? (
          <StateCard
            description={copy.lists.emptyDescription}
            title={copy.common.empty}
            variant="empty"
          />
        ) : (
          <div className={styles.sections}>
            {derived.projectSections
              .filter((section) => !section.project.isFavorite)
              .map((section) => (
                <div key={section.project.id} className={styles.section}>
                  <ProjectCard
                    onOpenProject={actions.openProjectEdit}
                    progress={section.progress}
                    project={section.project}
                    tasks={section.tasks}
                  />
                </div>
              ))}
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
