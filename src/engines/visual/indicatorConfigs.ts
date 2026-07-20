/**
 * Configurations d'indicateurs (Lot 4) — indexées par `variant` (= id de glyphe).
 * Pur : décrit quel indicateur calculer/afficher et ses paramètres. Lu par `VisualCard`
 * pour les specs `indicator`, rendu par `IndicatorPanel`.
 */
export type IndicatorKind = 'ma' | 'bollinger' | 'fibonacci' | 'rsi' | 'macd' | 'volume' | 'divergence';

export interface IndicatorConfig {
  datasetKey: string;
  kind: IndicatorKind;
  fast?: number;
  slow?: number;
  period?: number;
  k?: number;
  /** Divergence : oscillateur illustratif (0–100), aligné sur les bougies. */
  osc?: number[];
  /** Divergence : index des deux plus-hauts du prix (bougies). */
  priceHighs?: [number, number];
  /** Divergence : index des deux sommets de l'oscillateur. */
  oscHighs?: [number, number];
}

export const INDICATOR_CONFIGS: Record<string, IndicatorConfig> = {
  'moving-average': { datasetKey: 'indicator.ma.v1', kind: 'ma', fast: 3, slow: 6 },
  bollinger: { datasetKey: 'indicator.bollinger.v1', kind: 'bollinger', period: 5, k: 2 },
  fibonacci: { datasetKey: 'indicator.fib.v1', kind: 'fibonacci' },
  rsi: { datasetKey: 'indicator.rsi.v1', kind: 'rsi', period: 5 },
  macd: { datasetKey: 'indicator.macd.v1', kind: 'macd', fast: 3, slow: 6, period: 4 },
  volume: { datasetKey: 'indicator.volume.v1', kind: 'volume' },
  divergence: {
    datasetKey: 'indicator.divergence.v1',
    kind: 'divergence',
    osc: [45, 55, 72, 50, 58, 64, 52], // sommets en repli (72 → 64) : plus-bas relatif
    priceHighs: [2, 5],
    oscHighs: [2, 5],
  },
};

export function indicatorConfig(variant?: string): IndicatorConfig | undefined {
  return variant ? INDICATOR_CONFIGS[variant] : undefined;
}
