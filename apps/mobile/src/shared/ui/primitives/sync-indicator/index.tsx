import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Meta } from '../../typography';
import { getSyncStore, type SyncStatus } from '@shared/model/sync-store';

interface SyncIndicatorProps {
  showPendingCount?: boolean;
}

const ICONS: Record<SyncStatus, string> = {
  idle: '⏸',
  syncing: '⟳',
  synced: '✓',
  error: '✗',
};

const COLORS: Record<SyncStatus, string> = {
  idle: 'textSecondary',
  syncing: 'accentPrimary',
  synced: 'accentSuccess',
  error: 'accentAlert',
};

const LABELS: Record<SyncStatus, string> = {
  idle: 'Idle',
  syncing: 'Syncing...',
  synced: 'Synced',
  error: 'Sync Error',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export function SyncIndicator({ showPendingCount = true }: SyncIndicatorProps) {
  const { theme } = useTheme();
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [pendingCount, _setPendingCount] = useState(0);

  useEffect(() => {
    const store = getSyncStore();
    const unsubscribe = store.subscribe(state => {
      setStatus(state.status);
    });

    // Initial state
    setStatus(store.getState().status);

    return unsubscribe;
  }, []);

  const colorKey = COLORS[status];
  const color =
    theme.colors[colorKey as keyof typeof theme.colors] ??
    theme.colors.textSecondary;
  const icon = ICONS[status];
  const label =
    status === 'syncing'
      ? LABELS[status]
      : pendingCount > 0
        ? `${LABELS[status]} (${pendingCount})`
        : LABELS[status];

  return (
    <View style={[styles.container, { backgroundColor: `${color}10` }]}>
      {status === 'syncing' ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Meta style={{ color, fontSize: 12 }}>{icon}</Meta>
      )}
      {showPendingCount && <Meta style={{ color }}>{label}</Meta>}
    </View>
  );
}

export type { SyncIndicatorProps };
