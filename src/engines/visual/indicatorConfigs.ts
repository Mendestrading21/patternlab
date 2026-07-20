/**
 * Configurations d'indicateurs (Lot 4) — indexées par `variant` (= id de glyphe).
 * Pur : décrit quel indicateur calculer/afficher et ses paramètres. Lu par `VisualCard`
 * pour les specs `indicator`, rendu par `IndicatorPanel`.
 */
export type IndicatorKind =
  | 'ma'
  | 'bollinger'
  | 'fibonacci'
  | 'rsi'
  | 'macd'
  | 'volume'
  | 'divergence'
  | 'ribbon'
  | 'stochastic'
  | 'vwap'
  | 'atr';

export interface IndicatorConfig {
  datasetKey: string;
  kind: IndicatorKind;
  fast?: number;
  slow?: number;
  period?: number;
  k?: number;
  /** Ruban de moyennes : périodes des EMA à tracer. */
  ribbon?: number[];
  /** Divergence : oscillateur illustratif (0–100), aligné sur les bougies. */
  osc?: number[];
  /** Divergence : index des deux pivots du prix (bougies). */
  priceHighs?: [number, number];
  /** Divergence : index des deux pivots de l'oscillateur. */
  oscHighs?: [number, number];
  /** Divergence : pivot haut (plus-hauts) ou bas (creux). Défaut : haut. */
  pivot?: 'high' | 'low';
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
    pivot: 'high',
  },
  // ─── Extension Lot 4 ─────────────────────────────────────────────
  'golden-cross': { datasetKey: 'indicator.golden-cross.v1', kind: 'ma', fast: 3, slow: 6 },
  'death-cross': { datasetKey: 'indicator.death-cross.v1', kind: 'ma', fast: 3, slow: 6 },
  'bollinger-squeeze': { datasetKey: 'indicator.bollinger-squeeze.v1', kind: 'bollinger', period: 5, k: 2 },
  'ma-ribbon': { datasetKey: 'indicator.ma-ribbon.v1', kind: 'ribbon', ribbon: [3, 5, 8] },
  stochastic: { datasetKey: 'indicator.stochastic.v1', kind: 'stochastic', period: 5, k: 3 },
  vwap: { datasetKey: 'indicator.vwap.v1', kind: 'vwap' },
  atr: { datasetKey: 'indicator.atr.v1', kind: 'atr', period: 4 },
  'hidden-divergence': {
    datasetKey: 'indicator.hidden-divergence.v1',
    kind: 'divergence',
    osc: [55, 30, 52, 45, 25, 50, 58], // creux en baisse (30 → 25) : creux plus bas
    priceHighs: [1, 4], // pivots bas du prix (creux plus haut)
    oscHighs: [1, 4],
    pivot: 'low',
  },
};

export function indicatorConfig(variant?: string): IndicatorConfig | undefined {
  return variant ? INDICATOR_CONFIGS[variant] : undefined;
}
