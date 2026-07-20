import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, theme } from '@/design-system';
import type { VisualSpec } from '../../../data/learningConcept';
import { datasetByKey } from '../visualDatasets';
import { CandlestickGlyphs, type Zone } from './CandlestickGlyphs';
import { CandleAnatomy } from './CandleAnatomy';
import { figureOverlay } from '../figureOverlays';

export type VisualCardProps = {
  spec: VisualSpec;
  /** Titre optionnel affiché au-dessus du visuel. */
  title?: string;
};

/**
 * Rend un `VisualSpec` : dispatch par `type` vers le bon générateur SVG. Le résumé accessible
 * est visible ET porté par `accessibilityLabel` (information jamais transmise par la seule couleur).
 * Les types non encore couverts affichent un repli lisible.
 */
export function VisualCard({ spec, title }: VisualCardProps) {
  const candles = datasetByKey(spec.datasetKey);
  const summary = spec.accessibilitySummary;

  let visual: ReactNode;
  if (spec.type === 'candle-anatomy' && candles[0]) {
    visual = <CandleAnatomy candle={candles[0]} accessibilityLabel={summary} />;
  } else if (spec.type === 'candlestick-pattern' && candles.length) {
    visual = <CandlestickGlyphs candles={candles} accessibilityLabel={summary} />;
  } else if (spec.type === 'chart-pattern' && candles.length) {
    // Les figures chartistes portent des tracés (ligne de cou, tendances, canaux) via le registre.
    const overlay = figureOverlay(spec.variant);
    visual = (
      <CandlestickGlyphs
        candles={candles}
        guides={overlay?.guides}
        zones={overlay?.zones}
        markers={overlay?.markers}
        accessibilityLabel={summary}
      />
    );
  } else if (spec.type === 'market-structure' && candles.length) {
    const min = Math.min(...candles.map((c) => c.l));
    const max = Math.max(...candles.map((c) => c.h));
    const range = max - min || 1;
    const zones: Zone[] = [
      { from: min, to: min + range * 0.06, label: 'support', color: theme.colors.bullish },
      { from: max - range * 0.06, to: max, label: 'résistance', color: theme.colors.bearish },
    ];
    visual = <CandlestickGlyphs candles={candles} zones={zones} accessibilityLabel={summary} />;
  } else {
    visual = (
      <View style={styles.fallback} accessible accessibilityLabel={summary}>
        <Text variant="caption" color={theme.colors.textMuted} center>
          Visuel « {spec.variant} » — aperçu à venir.
        </Text>
      </View>
    );
  }

  return (
    <Card elevated>
      {title ? (
        <Text variant="label" color={theme.colors.textMuted}>
          {title}
        </Text>
      ) : null}
      <View style={styles.frame}>{visual}</View>
      {spec.labels.length ? (
        <View style={styles.chips}>
          {spec.labels.map((l) => (
            <Text key={l.text} variant="caption" color={theme.colors.textSecondary} style={styles.chip}>
              {l.text}
            </Text>
          ))}
        </View>
      ) : null}
      <Text variant="caption" color={theme.colors.textMuted}>
        {summary}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  frame: { marginVertical: theme.spacing.sm },
  fallback: { minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, marginBottom: theme.spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
});
