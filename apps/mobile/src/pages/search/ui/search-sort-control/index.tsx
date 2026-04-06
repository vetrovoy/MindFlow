import { Pressable, StyleSheet, View } from 'react-native';

import { useCopy } from '@shared/lib/use-copy';
import { useTheme } from '@shared/theme/use-theme';
import { Meta } from '@shared/ui/typography';

export type SearchSortOption = 'relevance' | 'date';

interface SearchSortControlProps {
  sortBy: SearchSortOption;
  onSortChange: (sort: SearchSortOption) => void;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export function SearchSortControl({ sortBy, onSortChange }: SearchSortControlProps) {
  const copy = useCopy();
  const { theme } = useTheme();

  return (
    <View style={styles.root}>
      <Meta tone="soft">{copy.search.sortLabel}</Meta>
      <Pressable
        onPress={() => onSortChange('relevance')}
        style={[
          styles.chip,
          {
            backgroundColor:
              sortBy === 'relevance'
                ? theme.colors.accentPrimary
                : 'transparent',
          },
        ]}
      >
        <Meta tone={sortBy === 'relevance' ? 'muted' : 'soft'}>
          {copy.search.sortByRelevance}
        </Meta>
      </Pressable>
      <Pressable
        onPress={() => onSortChange('date')}
        style={[
          styles.chip,
          {
            backgroundColor:
              sortBy === 'date' ? theme.colors.accentPrimary : 'transparent',
          },
        ]}
      >
        <Meta tone={sortBy === 'date' ? 'muted' : 'soft'}>
          {copy.search.sortByDate}
        </Meta>
      </Pressable>
    </View>
  );
}
