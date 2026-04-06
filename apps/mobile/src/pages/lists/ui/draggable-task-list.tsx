import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import DraggableFlatList, {
  type DragEndParams,
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import type { Task } from '@mindflow/domain';

import { Icon } from '@shared/ui/icons';
import { TaskRow } from '@shared/ui/primitives';

interface DraggableTaskListProps {
  tasks: Task[];
  projectId: string;
  onToggleDone: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
  onReorder: (projectId: string, orderedTaskIds: string[]) => Promise<void>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskRowFlex: {
    flex: 1,
  },
  dragHandle: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  separator: {
    height: 8,
  },
});

function TaskSeparator() {
  return <View style={styles.separator} />;
}

export function DraggableTaskList({
  tasks,
  projectId,
  onToggleDone,
  onOpenTask,
  onReorder,
}: DraggableTaskListProps) {
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Task>) => (
      <ScaleDecorator activeScale={1}>
        <View style={styles.row}>
          <View style={styles.taskRowFlex}>
            <TaskRow
              task={item}
              onToggleDone={onToggleDone}
              onOpenTask={onOpenTask}
              presentation="inbox"
              accessory={
                <View>
                  <Pressable
                    onLongPress={drag}
                    disabled={isActive}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.dragHandle}
                  >
                    <Icon decorative name="drag" size={16} tone="muted" />
                  </Pressable>
                </View>
              }
            />
          </View>
        </View>
      </ScaleDecorator>
    ),
    [onToggleDone, onOpenTask],
  );

  const handleDragEnd = useCallback(
    ({ data }: DragEndParams<Task>) => {
      void onReorder(
        projectId,
        data.map(t => t.id),
      );
    },
    [projectId, onReorder],
  );

  return (
    <DraggableFlatList
      data={tasks}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      scrollEnabled={false}
      ItemSeparatorComponent={TaskSeparator}
    />
  );
}
