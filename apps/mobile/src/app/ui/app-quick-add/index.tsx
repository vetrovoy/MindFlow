import { ProjectQuickAddFeature } from '@mobile/features/project-quick-add';
import { TaskQuickAddFeature } from '@mobile/features/task-quick-add';
import { useNavigationState } from '@react-navigation/native';

export function AppQuickAdd() {
  const activeTab = useNavigationState(state => {
    const tabState = state?.routes?.[0]?.state;
    if (tabState == null || tabState.index == null) return 'Inbox';
    return (tabState.routes[tabState.index]?.name as string) ?? 'Inbox';
  });

  const isInbox = activeTab === 'Inbox';
  const isToday = activeTab === 'Today';
  const isLists = activeTab === 'Lists';

  const todayDateKey = new Date().toISOString().slice(0, 10);

  const renderQuickAdd = () => {
    if (isInbox || isToday) {
      return (
        <TaskQuickAddFeature preferredDate={isToday ? todayDateKey : null} />
      );
    }
    if (isLists) {
      return <ProjectQuickAddFeature />;
    }
    return null;
  };

  return <>{renderQuickAdd()}</>;
}
