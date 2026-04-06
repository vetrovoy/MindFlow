import { StyleSheet, View } from 'react-native';

import { SkeletonLine } from './skeleton-line';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  main: {
    flex: 1,
    gap: 8,
  },
});

export function SkeletonTaskRow() {
  return (
    <View style={styles.row}>
      <View style={[styles.checkbox, { backgroundColor: '#E0E0E0' }]} />
      <View style={styles.main}>
        <SkeletonLine width="70%" height={16} />
        <SkeletonLine width="40%" height={12} />
      </View>
    </View>
  );
}
