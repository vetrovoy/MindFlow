import { useMobileAppStore } from '@shared/model/app-store-provider';
import {
  FeedbackCard,
  ProjectCard,
  ScreenShell,
  SectionHeader,
  SurfaceCard,
} from '@shared/ui/primitives';

export function ListsPage() {
  const sections = useMobileAppStore(store => store.derived.projectSections);

  return (
    <ScreenShell
      title="Lists"
      subtitle="Карточки проектов и прогресс-паттерны для следующих мобильных экранов."
    >
      <SurfaceCard elevated>
        <SectionHeader
          title="Проекты"
          subtitle={
            sections.length > 0
              ? `${sections.length} активных списков готовы к рендеру`
              : 'Пока нет проектов'
          }
        />
      </SurfaceCard>

      {sections.length === 0 ? (
        <FeedbackCard
          variant="loading"
          title="Ждём первые списки"
          description="Когда проекты появятся, эта секция будет собрана из тех же UI primitives."
        />
      ) : (
        sections.map(section => (
          <ProjectCard
            key={section.project.id}
            project={section.project}
            taskCount={section.progress.total}
            doneCount={section.progress.done}
          />
        ))
      )}
    </ScreenShell>
  );
}
