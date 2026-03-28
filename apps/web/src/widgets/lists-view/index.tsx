import { useCopy } from "@/app/providers/language-provider";
import { ProjectTaskReorderFeature } from "@/features/project-task-reorder";
import { useAppState } from "@/shared/model/app-store-provider";
import { ProjectCard } from "@/shared/ui";
import { SectionTitle, StateCard, SurfaceCard } from "@/shared/ui/primitives";
import styles from "./index.module.css";

export function ListsViewWidget() {
  const copy = useCopy();
  const { actions, derived } = useAppState();
  const favoriteSections = derived.projectSections.filter((section) => section.project.isFavorite);
  const regularSections = derived.projectSections.filter((section) => !section.project.isFavorite);

  function renderProjectTasks(projectId: string, tasks: typeof derived.projectSections[number]["tasks"]) {
    if (tasks.length === 0) {
      return (
        <StateCard
          description={copy.lists.favoriteEmptyDescription}
          title={copy.common.empty}
          variant="empty"
        />
      );
    }

    return <ProjectTaskReorderFeature projectId={projectId} tasks={tasks} />;
  }

  return (
    <div className={styles.root}>
      {derived.projectSections.length === 0 ? (
        <SurfaceCard>
          <SectionTitle title={copy.lists.allTitle} />
          <StateCard
            description={copy.lists.emptyDescription}
            title={copy.common.empty}
            variant="empty"
          />
        </SurfaceCard>
      ) : null}
      {favoriteSections.length > 0 ? (
        <SurfaceCard>
          <SectionTitle
            subtitle={copy.lists.favoritesSubtitle}
            title={copy.lists.favoritesTitle}
          />
          <div className={styles.sections}>
            {favoriteSections.map((section) => (
                <div key={section.project.id} className={styles.section}>
                  <ProjectCard
                    onOpenProject={actions.openProjectEdit}
                    progress={section.progress}
                    project={section.project}
                    tasks={section.tasks}
                  />
                  {renderProjectTasks(section.project.id, section.tasks)}
                </div>
              ))}
          </div>
        </SurfaceCard>
      ) : null}
      {regularSections.length > 0 ? (
        <SurfaceCard>
          <SectionTitle title={copy.lists.allTitle} />
          <div className={styles.sections}>
            {regularSections.map((section) => (
                <div key={section.project.id} className={styles.section}>
                  <ProjectCard
                    onOpenProject={actions.openProjectEdit}
                    progress={section.progress}
                    project={section.project}
                    tasks={section.tasks}
                  />
                  {renderProjectTasks(section.project.id, section.tasks)}
                </div>
              ))}
          </div>
        </SurfaceCard>
      ) : null}
    </div>
  );
}
