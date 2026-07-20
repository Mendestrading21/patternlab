/**
 * Registre des comparaisons (type visuel `comparison`) — deux schémas côte à côte,
 * chacun renvoyant à un dataset OHLC déterministe + une légende. Aucune donnée réelle.
 */
export interface ComparisonSide {
  datasetKey: string;
  caption: string;
}
export interface Comparison {
  left: ComparisonSide;
  right: ComparisonSide;
}

export const COMPARISONS: Record<string, Comparison> = {
  'bull-vs-bear': {
    left: { datasetKey: 'candle.bullish-marubozu.v1', caption: 'Haussière (verte)' },
    right: { datasetKey: 'candle.bearish-marubozu.v1', caption: 'Baissière (rouge)' },
  },
  'trend-vs-range': {
    left: { datasetKey: 'structure.uptrend.v1', caption: 'Tendance' },
    right: { datasetKey: 'structure.support-resistance.v1', caption: 'Range' },
  },
  'doji-vs-marubozu': {
    left: { datasetKey: 'candle.doji.v1', caption: 'Indécision (doji)' },
    right: { datasetKey: 'candle.bullish-marubozu.v1', caption: 'Conviction (marubozu)' },
  },
  'uptrend-vs-downtrend': {
    left: { datasetKey: 'structure.uptrend.v1', caption: 'Haussière' },
    right: { datasetKey: 'structure.downtrend.v1', caption: 'Baissière' },
  },
};

export function comparison(variant: string): Comparison | undefined {
  return COMPARISONS[variant];
}
