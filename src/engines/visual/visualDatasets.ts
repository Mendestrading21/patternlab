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

// ─── Chandeliers simples (une bougie) ────────────────────────────────
const ANATOMY: Candle[] = [{ o: 46, h: 56, l: 42, c: 52 }];
const HAMMER: Candle[] = [{ o: 52, h: 53, l: 45, c: 52.6 }]; // petit corps haut, longue mèche basse
const HANGING_MAN: Candle[] = [{ o: 52.6, h: 53, l: 45, c: 52 }]; // même forme, corps baissier (contexte de hausse)
const INVERTED_HAMMER: Candle[] = [{ o: 48, h: 56, l: 47.6, c: 48.6 }]; // petit corps bas, longue mèche haute
const DOJI: Candle[] = [{ o: 50, h: 54, l: 46, c: 50.1 }];
const DRAGONFLY_DOJI: Candle[] = [{ o: 52, h: 52.3, l: 45, c: 52 }]; // doji en haut, longue mèche basse
const GRAVESTONE_DOJI: Candle[] = [{ o: 48, h: 55, l: 47.7, c: 48 }]; // doji en bas, longue mèche haute
const SPINNING_TOP: Candle[] = [{ o: 49.4, h: 54, l: 46, c: 50.6 }]; // petit corps centré, mèches des deux côtés
const SHOOTING_STAR: Candle[] = [{ o: 50, h: 58, l: 49.5, c: 50.4 }];
const BULLISH_MARUBOZU: Candle[] = [{ o: 44, h: 56, l: 44, c: 56 }]; // grand corps haussier, sans mèche
const BEARISH_MARUBOZU: Candle[] = [{ o: 56, h: 56, l: 44, c: 44 }]; // grand corps baissier, sans mèche

// ─── Chandeliers doubles (deux bougies) ──────────────────────────────
const BULLISH_ENGULFING: Candle[] = [
  { o: 52, h: 52.6, l: 49, c: 49.4 },
  { o: 49, h: 53.6, l: 48.8, c: 53.2 },
];
const BEARISH_ENGULFING: Candle[] = [
  { o: 49, h: 53.2, l: 48.8, c: 52.8 },
  { o: 53.2, h: 53.6, l: 48.4, c: 48.8 },
];
// Grand corps baissier puis petit corps haussier contenu dans le précédent.
const BULLISH_HARAMI: Candle[] = [
  { o: 56, h: 56.5, l: 49, c: 49.5 },
  { o: 51, h: 52.5, l: 50.3, c: 52 },
];
// Grand corps haussier puis petit corps baissier contenu dans le précédent.
const BEARISH_HARAMI: Candle[] = [
  { o: 49, h: 56.5, l: 48.5, c: 56 },
  { o: 54, h: 54.5, l: 52, c: 52.5 },
];
// Bougie baissière puis bougie haussière qui clôture au-dessus du milieu du corps précédent (≈ 52.2).
const PIERCING_LINE: Candle[] = [
  { o: 55, h: 55.4, l: 49, c: 49.4 },
  { o: 48.6, h: 53, l: 48.2, c: 52.6 },
];
// Bougie haussière puis bougie baissière qui clôture sous le milieu du corps précédent (≈ 52).
const DARK_CLOUD_COVER: Candle[] = [
  { o: 49, h: 55.4, l: 48.6, c: 55 },
  { o: 55.6, h: 55.8, l: 50.8, c: 51.2 },
];
// Deux bougies aux plus-hauts identiques (56) : rejet répété d'un plafond.
const TWEEZER_TOP: Candle[] = [
  { o: 50, h: 56, l: 49.6, c: 55.4 },
  { o: 55.4, h: 56, l: 50, c: 50.4 },
];
// Deux bougies aux plus-bas identiques (44) : rejet répété d'un plancher.
const TWEEZER_BOTTOM: Candle[] = [
  { o: 50, h: 50.4, l: 44, c: 44.6 },
  { o: 44.6, h: 49.8, l: 44, c: 49.4 },
];

// ─── Chandeliers triples (trois bougies) ─────────────────────────────
const MORNING_STAR: Candle[] = [
  { o: 56, h: 56.4, l: 50, c: 50.4 }, // grande baissière
  { o: 49.6, h: 50, l: 48.8, c: 49.4 }, // étoile (petit corps)
  { o: 50, h: 56, l: 49.6, c: 55.6 }, // grande haussière
];
const EVENING_STAR: Candle[] = [
  { o: 48, h: 54.4, l: 47.6, c: 54 }, // grande haussière
  { o: 54.4, h: 55.2, l: 54, c: 54.6 }, // étoile (petit corps)
  { o: 54, h: 54.4, l: 48, c: 48.4 }, // grande baissière
];
const THREE_WHITE_SOLDIERS: Candle[] = [
  { o: 46, h: 49.4, l: 45.6, c: 49 },
  { o: 48.4, h: 52.4, l: 48, c: 52 },
  { o: 51.4, h: 55.4, l: 51, c: 55 },
];
const THREE_BLACK_CROWS: Candle[] = [
  { o: 56, h: 56.4, l: 52.6, c: 53 },
  { o: 54.4, h: 54.8, l: 50.6, c: 51 },
  { o: 52.4, h: 52.8, l: 48.6, c: 49 },
];

// ─── Structure de marché / figures ───────────────────────────────────
// « W » : deux creux proches (46 / 45.6) séparés par un sommet (ligne de cou ≈ 52).
const DOUBLE_BOTTOM = seriesFromTargets([62, 57, 53, 49, 46, 49, 52, 50, 47, 45.6, 49, 54, 58, 62]);
// « M » : deux sommets proches (55 / 55) séparés par un creux (ligne de cou ≈ 48), puis cassure basse.
const DOUBLE_TOP = seriesFromTargets([38, 44, 49, 53, 55, 51, 48, 51, 55, 55, 51, 47, 43, 39]);
// Range : oscille entre ≈ 48 (support) et ≈ 62 (résistance).
const RANGE = seriesFromTargets([50, 58, 61, 54, 49, 52, 60, 62, 55, 50, 48, 53, 59, 61, 52, 49]);
// Tendance haussière : sommets et creux de plus en plus hauts (HH/HL).
const UPTREND = seriesFromTargets([40, 46, 43, 50, 47, 55, 52, 60, 57, 64]);
// Tendance baissière : sommets et creux de plus en plus bas (LH/LL).
const DOWNTREND = seriesFromTargets([64, 58, 61, 52, 55, 47, 50, 42, 45, 40]);
// Cassure de structure : progression haussière (HH/HL) puis rupture sous le dernier creux.
const BOS = seriesFromTargets([44, 50, 47, 55, 51, 58, 53, 48, 43]);

export const VISUAL_DATASETS: Record<string, Candle[]> = {
  // Chandeliers simples
  'candle.anatomy.v1': ANATOMY,
  'candle.hammer.v1': HAMMER,
  'candle.hanging-man.v1': HANGING_MAN,
  'candle.inverted-hammer.v1': INVERTED_HAMMER,
  'candle.doji.v1': DOJI,
  'candle.dragonfly-doji.v1': DRAGONFLY_DOJI,
  'candle.gravestone-doji.v1': GRAVESTONE_DOJI,
  'candle.spinning-top.v1': SPINNING_TOP,
  'candle.shooting-star.v1': SHOOTING_STAR,
  'candle.bullish-marubozu.v1': BULLISH_MARUBOZU,
  'candle.bearish-marubozu.v1': BEARISH_MARUBOZU,
  // Chandeliers doubles
  'candle.bullish-engulfing.v1': BULLISH_ENGULFING,
  'candle.bearish-engulfing.v1': BEARISH_ENGULFING,
  'candle.bullish-harami.v1': BULLISH_HARAMI,
  'candle.bearish-harami.v1': BEARISH_HARAMI,
  'candle.piercing-line.v1': PIERCING_LINE,
  'candle.dark-cloud-cover.v1': DARK_CLOUD_COVER,
  'candle.tweezer-top.v1': TWEEZER_TOP,
  'candle.tweezer-bottom.v1': TWEEZER_BOTTOM,
  // Chandeliers triples
  'candle.morning-star.v1': MORNING_STAR,
  'candle.evening-star.v1': EVENING_STAR,
  'candle.three-white-soldiers.v1': THREE_WHITE_SOLDIERS,
  'candle.three-black-crows.v1': THREE_BLACK_CROWS,
  // Structure / figures
  'pattern.double-bottom.v1': DOUBLE_BOTTOM,
  'pattern.double-top.v1': DOUBLE_TOP,
  'structure.support-resistance.v1': RANGE,
  'structure.uptrend.v1': UPTREND,
  'structure.downtrend.v1': DOWNTREND,
  'structure.bos.v1': BOS,
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
