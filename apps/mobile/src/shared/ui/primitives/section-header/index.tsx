import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Body, SectionTitleText } from '../../typography';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionText: {
    flex: 1,
    gap: 4,
  },
});

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
        <SectionTitleText>{title}</SectionTitleText>
        {subtitle ? <Body tone="secondary">{subtitle}</Body> : null}
      </View>
      {action}
    </View>
  );
}

export type { SectionHeaderProps };
