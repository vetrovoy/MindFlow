import { useMobileAppStore } from '@shared/model/app-store-provider';
import {
  AccentButton,
  FeedbackCard,
  ScreenShell,
  SectionHeader,
  SurfaceCard,
  TaskRow,
} from '@shared/ui/primitives';
import { Body } from '@shared/ui/typography';

export function InboxPage() {
  const tasks = useMobileAppStore(store => store.derived.inboxTasks);
  const projects = useMobileAppStore(store => store.state.projects);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);

  return (
    <ScreenShell
      title="Inbox"
      subtitle="Локальные задачи без проекта. Основа для списка, row-компонента и feedback-состояний."
      accessory={<AccentButton>Quick add</AccentButton>}
    >
      <SurfaceCard elevated>
        <SectionHeader
          title="Активные"
          subtitle={tasks.length > 0 ? `${tasks.length} задач в очереди` : 'Нет активных inbox-задач'}
        />
      </SurfaceCard>

      {tasks.length === 0 ? (
        <FeedbackCard
          variant="empty"
          title="Inbox пока пуст"
          description="Следующие задачи смогут переиспользовать этот empty-state без хардкодов цветов."
        />
      ) : (
        tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            project={projects.find(project => project.id === task.projectId) ?? null}
            onToggleDone={toggleTask}
          />
        ))
      )}

      <Body tone="soft">
        Примитив `TaskRow` уже использует theme colors и shared typography tokens.
      </Body>
    </ScreenShell>
  );
}
