import { View, StyleSheet } from 'react-native';
import { Text, theme } from '@/design-system';
import { CandlestickGlyphs } from './CandlestickGlyphs';
import { datasetByKey } from '../visualDatasets';
import type { CheatItem } from '../cheatSheets';

export type CheatSheetVisualProps = {
  items: CheatItem[];
  accessibilityLabel?: string;
};

/** Aide-mémoire : grille de mini-schémas de bougies légendés (deux colonnes). */
export function CheatSheetVisual({ items, accessibilityLabel }: CheatSheetVisualProps) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={styles.grid}>
      {items.map((it, i) => (
        <View key={i} style={styles.cell}>
          <CandlestickGlyphs candles={datasetByKey(it.datasetKey)} box={{ width: 130, height: 78, padY: 8 }} />
          <Text variant="caption" color={theme.colors.textMuted}>
            {it.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  cell: { width: '47%', gap: 2 },
});
