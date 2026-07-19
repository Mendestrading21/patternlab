/**
 * Datasets OHLC déterministes pour les visuels V5, indexés par `datasetKey`.
 * Valeurs choisies pour la lisibilité pédagogique ; aucune donnée temps réel, aucun hasard.
 * Les micro-patterns (1–2 bougies) sont codés en dur ; les séries sont construites depuis
 * une liste de cibles (déterministe, lisible et testable).
 */
import type { Candle } from '../pattern/types';

/** Construit une série : chaque bougie ouvre au close précédent et clôture à la cible. */
export function seriesFromTargets(targets: number[], wick = 0.6): Candle[] {
  const out: Candle[] = [];
  let prev = targets[0];
  for (let i = 1; i < targets.length; i++) {
    const o = prev;
    const c = targets[i];
    out.push({ o, c, h: Math.max(o, c) + wick, l: Math.min(o, c) - wick });
    prev = c;
  }
  return out;
}

const ANATOMY: Candle[] = [{ o: 46, h: 56, l: 42, c: 52 }];
const HAMMER: Candle[] = [{ o: 52, h: 53, l: 45, c: 52.6 }];
const DOJI: Candle[] = [{ o: 50, h: 54, l: 46, c: 50.1 }];
const SHOOTING_STAR: Candle[] = [{ o: 50, h: 58, l: 49.5, c: 50.4 }];
const BULLISH_ENGULFING: Candle[] = [
  { o: 52, h: 52.6, l: 49, c: 49.4 },
  { o: 49, h: 53.6, l: 48.8, c: 53.2 },
];
// « W » : deux creux proches (46 / 45.6) séparés par un sommet (ligne de cou ≈ 52).
const DOUBLE_BOTTOM = seriesFromTargets([62, 57, 53, 49, 46, 49, 52, 50, 47, 45.6, 49, 54, 58, 62]);
// Range : oscille entre ≈ 48 (support) et ≈ 62 (résistance).
const RANGE = seriesFromTargets([50, 58, 61, 54, 49, 52, 60, 62, 55, 50, 48, 53, 59, 61, 52, 49]);

export const VISUAL_DATASETS: Record<string, Candle[]> = {
  'candle.anatomy.v1': ANATOMY,
  'candle.hammer.v1': HAMMER,
  'candle.doji.v1': DOJI,
  'candle.shooting-star.v1': SHOOTING_STAR,
  'candle.bullish-engulfing.v1': BULLISH_ENGULFING,
  'pattern.double-bottom.v1': DOUBLE_BOTTOM,
  'structure.support-resistance.v1': RANGE,
};

export function datasetByKey(key?: string): Candle[] {
  return (key && VISUAL_DATASETS[key]) || [];
}

/** Types de `VisualSpec` rendus par le moteur (les autres affichent un repli). */
export const SUPPORTED_VISUAL_TYPES = [
  'candle-anatomy',
  'candlestick-pattern',
  'chart-pattern',
  'market-structure',
] as const;
