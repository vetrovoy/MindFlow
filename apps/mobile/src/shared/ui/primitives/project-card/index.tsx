import { Pressable, StyleSheet, View } from 'react-native';

import type { Project } from '@mindflow/domain';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Title } from '../../typography';
import { SurfaceCard } from '../surface-card';
import { ProgressBar } from '../progress-bar';
import { StatusPill } from '../status-pill';

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

export function ProjectCard({ project, taskCount, doneCount, onPress }: ProjectCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <SurfaceCard elevated>
        <View style={{ gap: 14 }}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1, flexDirection:'row', alignItems:'center', gap: 4 }}>
              <View style={{ backgroundColor: project.color, width: 12, height:12, borderRadius: 999 }} />
              <Title>{project.name}</Title>
              <Body tone="secondary">
                {doneCount} из {taskCount} завершено
              </Body>
            </View>
            {project.isFavorite ? (
              <StatusPill label="Fav" variant="today" />
            ) : null}
          </View>
          <ProgressBar value={doneCount} max={Math.max(taskCount, 1)} />
          <Body tone="soft">Цвет проекта: {project.color}</Body>
          <View
            style={{
              position: 'absolute',
              top: -18,
              right: -10,
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: `${project.color}20`,
            }}
          />
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

export type { ProjectCardProps };
