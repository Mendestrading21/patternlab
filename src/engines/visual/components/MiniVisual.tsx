import { View } from 'react-native';
import { theme } from '@/design-system';
import type { VisualSpec } from '../../../data/learningConcept';
import { datasetByKey } from '../visualDatasets';
import { figureOverlay } from '../figureOverlays';
import { CandlestickGlyphs, type Zone } from './CandlestickGlyphs';
import { OptionPayoff } from './OptionPayoff';

/**
 * Vignette visuelle compacte (Lot 5) — un « signal » de la figure, à glisser sur une carte de
 * quiz / révision. Réutilise le moteur SVG dans une petite boîte, sans texte (le résumé reste porté
 * par `accessibilityLabel`). Types non-bougie (indicateurs) : la série de prix suffit comme signal.
 */
export function MiniVisual({ spec, width = 132 }: { spec: VisualSpec; width?: number }) {
  const summary = spec.accessibilitySummary;
  // Payoff d'option : pas de dataset OHLC, rendu dédié.
  if (spec.type === 'option-payoff') {
    return (
      <View style={{ width }}>
        <OptionPayoff kind={spec.variant === 'put' ? 'put' : 'call'} hideLabels accessibilityLabel={summary} />
      </View>
    );
  }
  const candles = datasetByKey(spec.datasetKey);
  if (!candles.length) return null;
  const box = { width, height: Math.round(width * 0.56), padY: 7 };

  if (spec.type === 'chart-pattern') {
    const o = figureOverlay(spec.variant);
    return (
      <View style={{ width }}>
        <CandlestickGlyphs candles={candles} box={box} guides={o?.guides} zones={o?.zones} markers={o?.markers} accessibilityLabel={summary} />
      </View>
    );
  }
  if (spec.type === 'market-structure') {
    const min = Math.min(...candles.map((c) => c.l));
    const max = Math.max(...candles.map((c) => c.h));
    const range = max - min || 1;
    const zones: Zone[] = [
      { from: min, to: min + range * 0.08, color: theme.colors.bullish },
      { from: max - range * 0.08, to: max, color: theme.colors.bearish },
    ];
    return (
      <View style={{ width }}>
        <CandlestickGlyphs candles={candles} box={box} zones={zones} accessibilityLabel={summary} />
      </View>
    );
  }
  // candle-anatomy, candlestick-pattern, indicator → série de bougies en petit.
  return (
    <View style={{ width }}>
      <CandlestickGlyphs candles={candles} box={box} accessibilityLabel={summary} />
    </View>
  );
}
