import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '../../icons';
import { Meta, Title } from '../../typography';
import { SurfaceCard } from '../surface-card';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  content: {
    padding: 10,
    gap: 10,
  },
});

export function CollapsibleSection({
  children,
  contentStyle,
  count,
  defaultOpen = true,
  style,
  title,
}: CollapsibleSectionProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SurfaceCard padded={false} style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => {
          setIsOpen(current => !current);
        }}
        style={styles.trigger}
      >
        <View style={styles.heading}>
          <Title>{title}</Title>
          {count == null ? null : <Meta tone="soft">{count}</Meta>}
        </View>
        <Icon
          decorative
          name={isOpen ? 'chevron-down' : 'chevron-right'}
          size={16}
          tone="muted"
        />
      </Pressable>
      <View style={[styles.divider, { backgroundColor: theme.colors.borderSoft }]} />
      {isOpen ? <View style={[styles.content, contentStyle]}>{children}</View> : null}
    </SurfaceCard>
  );
}

export type { CollapsibleSectionProps };
