import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme/use-theme';
import { Body } from '@mobile/shared/ui/typography';

export function ListsPage() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Body style={[styles.title, { color: theme.colors.textPrimary }]}>Lists</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
