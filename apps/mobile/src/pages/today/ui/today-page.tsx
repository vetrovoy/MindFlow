import { useMobileAppStore } from '@shared/model/app-store-provider';
import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import {
  FeedbackCard,
  ScreenShell,
  SectionHeader,
  SurfaceCard,
  TodayTaskCard,
} from '@shared/ui/primitives';
import { Body } from '@shared/ui/typography';

export function TodayPage() {
  const todayFeed = useMobileAppStore(store => store.derived.todayFeed);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);

  return (
    <>
      <ScreenShell
        title="Today"
        subtitle="Смешанная лента для overdue и due-today задач с shared feedback-механикой."
      >
        <SurfaceCard elevated>
          <SectionHeader
            title="Фокус дня"
            subtitle={
              todayFeed.length > 0
                ? `${todayFeed.length} элементов в производной ленте`
                : 'Сегодня ничего не горит'
            }
          />
        </SurfaceCard>

        {todayFeed.length === 0 ? (
          <FeedbackCard
            variant="empty"
            title="Чистый Today"
            description="Когда появятся due-today и overdue задачи, они будут рендериться единым карточным паттерном."
          />
        ) : (
          todayFeed.map(item => (
            <TodayTaskCard key={`${item.bucket}-${item.task.id}`} item={item} onToggleDone={toggleTask} />
          ))
        )}

        <Body tone="soft">
          Bottom sheet ниже уже готов как контейнер для task-edit flow из следующих задач.
        </Body>
      </ScreenShell>

      <TaskEditSheet />
    </>
  );
}
