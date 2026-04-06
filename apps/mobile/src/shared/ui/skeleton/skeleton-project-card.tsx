import { StyleSheet, View } from 'react-native';

import { SkeletonLine } from './skeleton-line';
import { SurfaceCard } from '@shared/ui/primitives';

const styles = StyleSheet.create({
  card: {
    gap: 14,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
});

export function SkeletonProjectCard() {
  return (
    <SurfaceCard elevated>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.dot} />
          <SkeletonLine width="50%" height={18} />
        </View>
        <SkeletonLine width="30%" height={8} />
      </View>
    </SurfaceCard>
  );
}
