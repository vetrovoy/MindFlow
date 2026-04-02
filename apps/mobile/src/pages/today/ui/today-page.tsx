import { useMobileAppStore } from '@shared/model/app-store-provider';
import {
  BottomSheet,
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
  const editingTask = useMobileAppStore(store => store.derived.editingTask);
  const closeTaskEdit = useMobileAppStore(store => store.actions.closeTaskEdit);

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

      <BottomSheet
        visible={editingTask != null}
        title={editingTask?.title ?? 'Редактирование задачи'}
        subtitle="Здесь позже появится полноценный editor flow."
        onClose={closeTaskEdit}
      >
        <Body tone="secondary">
          Примитив листа подключён и умеет жить в текущей теме без прямых импортов из `packages/ui` React-слоя.
        </Body>
      </BottomSheet>
    </>
  );
}
