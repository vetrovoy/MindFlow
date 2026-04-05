import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { Project } from '@mindflow/domain';
import { getCopy } from '@mindflow/copy';

import { useTheme } from '@shared/theme/use-theme';
import { BottomSheet } from '../bottom-sheet';
import { Icon } from '../../icons';
import { Body, Meta } from '../../typography';

const copy = getCopy('ru');

interface ProjectSelectorProps {
  value: string | null;
  onChange: (projectId: string | null) => void;
  projects: Project[];
  favoriteProjects: Project[];
  label?: string;
}

interface ProjectRowProps {
  project: Project | null;
  active: boolean;
  onPress: () => void;
}

function ProjectRow({ project, active, onPress }: ProjectRowProps) {
  const { theme } = useTheme();

  const label = project == null ? copy.projectSelector.inbox : `${project.name}`;
  const colorDot = project?.color;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: active ? theme.colors.surfaceInteractive : theme.colors.surface,
          borderColor: active ? theme.colors.accentPrimaryPanelBorder : theme.colors.borderSoft,
        },
      ]}
    >
      {colorDot != null && <View style={[styles.colorDot, { backgroundColor: colorDot }]} />}
      {colorDot == null && (
        <Icon decorative name="nav-inbox" size={14} tone={active ? 'accent' : 'muted'} />
      )}
      <View style={styles.rowLabel}>
        <Meta tone={active ? 'accent' : 'primary'}>{label}</Meta>
      </View>
      {active && <Icon decorative name="check" size={16} tone="accent" />}
    </Pressable>
  );
}

export function ProjectSelector({
  value,
  onChange,
  projects,
  favoriteProjects,
  label,
}: ProjectSelectorProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedProject = useMemo(
    () => projects.find(p => p.id === value) ?? null,
    [projects, value],
  );

  const regularProjects = useMemo(
    () => projects.filter(p => !favoriteProjects.some(fp => fp.id === p.id)),
    [projects, favoriteProjects],
  );

  function handlePress() {
    setIsOpen(true);
  }

  function handleSelect(projectId: string | null) {
    onChange(projectId);
    setIsOpen(false);
  }

  function handleClose() {
    setIsOpen(false);
  }

  const previewLabel = selectedProject != null
    ? `${selectedProject.name}`
    : copy.projectSelector.inbox;

  const previewColor = selectedProject?.color;

  return (
    <View style={styles.container}>
      {label != null ? <Meta tone="soft">{label}</Meta> : null}
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        {previewColor != null && (
          <View style={[styles.previewDot, { backgroundColor: previewColor }]} />
        )}
        {previewColor == null && (
          <Icon decorative name="nav-inbox" size={14} tone="muted" />
        )}
        <Body tone={selectedProject != null ? 'primary' : 'secondary'} style={styles.previewText}>
          {previewLabel}
        </Body>
        <Icon decorative name="chevron-down" size={16} tone="muted" />
      </Pressable>

      <BottomSheet
        visible={isOpen}
        title={copy.projectSelector.title}
        onClose={handleClose}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          {/* Inbox */}
          <ProjectRow
            project={null}
            active={value == null}
            onPress={() => { handleSelect(null); }}
          />

          {/* Favorites */}
          {favoriteProjects.length > 0 && (
            <View style={styles.section}>
              <Meta tone="soft">{copy.projectSelector.favoritesSection}</Meta>
              {favoriteProjects.map(project => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  active={value === project.id}
                  onPress={() => { handleSelect(project.id); }}
                />
              ))}
            </View>
          )}

          {/* All lists */}
          {regularProjects.length > 0 && (
            <View style={styles.section}>
              <Meta tone="soft">{copy.projectSelector.allListsSection}</Meta>
              {regularProjects.map(project => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  active={value === project.id}
                  onPress={() => { handleSelect(project.id); }}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

export type { ProjectSelectorProps };

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  trigger: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewText: {
    flex: 1,
  },
  sheetContent: {
    gap: 12,
    paddingBottom: 16,
  },
  section: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowLabel: {
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
