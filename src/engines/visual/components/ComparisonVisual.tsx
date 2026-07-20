import { View, StyleSheet } from 'react-native';
import { Text, theme } from '@/design-system';
import { CandlestickGlyphs } from './CandlestickGlyphs';
import { datasetByKey } from '../visualDatasets';
import type { Comparison } from '../comparisons';

export type ComparisonVisualProps = {
  comparison: Comparison;
  accessibilityLabel?: string;
};

/** Comparaison côte à côte de deux schémas de bougies, chacun légendé. */
export function ComparisonVisual({ comparison, accessibilityLabel }: ComparisonVisualProps) {
  const sides = [comparison.left, comparison.right];
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={styles.row}>
      {sides.map((s, i) => (
        <View key={i} style={styles.col}>
          <Text variant="caption" color={theme.colors.textSecondary} center>
            {s.caption}
          </Text>
          <CandlestickGlyphs candles={datasetByKey(s.datasetKey)} box={{ width: 150, height: 118, padY: 10 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  col: { flex: 1, gap: 2 },
});
