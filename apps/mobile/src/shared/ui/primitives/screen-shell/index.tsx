import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Display } from '../../typography';

interface ScreenShellProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  accessory?: ReactNode;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  screenHeader: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export function ScreenShell({ title, subtitle, accessory, children }: ScreenShellProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenHeader}>
        <View style={styles.headerRow}>
          {title && <Display>{title}</Display>}
          {accessory}
        </View>
        {subtitle ? <Body tone="secondary">{subtitle}</Body> : null}
      </View>
      {children}
    </ScrollView>
  );
}

export type { ScreenShellProps };
