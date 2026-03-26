import { ProjectTaskReorderFeature } from "@/features/project-task-reorder";
import { useMindFlowApp } from "@/shared/model/mindflow-provider";
import { ProjectCard } from "@/shared/ui";
import {
  SectionTitle,
  StateCard,
  SurfaceCard
} from "@/shared/ui/primitives";
import styles from "./index.module.css";

export function ListsViewWidget() {
  const { actions, derived } = useMindFlowApp();

  return (
    <div className={styles.root}>
      {derived.favoriteProjects.length > 0 ? (
        <SurfaceCard>
          <SectionTitle
            subtitle="Избранные списки остаются сверху для быстрого доступа."
            title="Избранное"
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
                      description="Привяжите задачи к этому списку."
                      title="Пусто"
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
        <SectionTitle
          title="Все списки"
        />
        {derived.regularProjects.length === 0 ? (
          <StateCard
            description="Создайте первый список, затем перенесите в него выбранные задачи."
            title="Пусто"
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
