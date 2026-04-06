import { Pressable, StyleSheet, View } from 'react-native';

import type { Project } from '@mindflow/domain';

import { Title } from '../../typography';
import { SurfaceCard } from '../surface-card';
import { ProgressBar } from '../progress-bar';
import { Icon } from '../../icons';

interface ProjectCardProps {
  project: Project;
  taskCount: number;
  doneCount: number;
  onPress?: () => void;
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export function ProjectCard({
  project,
  taskCount,
  doneCount,
  onPress,
}: ProjectCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <SurfaceCard elevated>
        <View style={{ gap: 14 }}>
          <View style={styles.headerRow}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: project.color,
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                }}
              />
              <Title>{project.name}</Title>
            </View>
            {project.isFavorite ? (
              <Icon decorative name="favorite" size={16} tone="accent" />
            ) : null}
          </View>
          <ProgressBar value={doneCount} max={Math.max(taskCount, 1)} />
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

export type { ProjectCardProps };
