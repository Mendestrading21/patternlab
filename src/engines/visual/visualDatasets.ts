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

// ─── Figures chartistes (Lot 2) ──────────────────────────────────────
// Trois planchers proches (≈ 46) séparés par des sommets (ligne de cou ≈ 53), puis cassure haute.
const TRIPLE_BOTTOM = seriesFromTargets([60, 54, 46, 52, 46, 52, 46, 54, 61]);
// Trois plafonds proches (≈ 54) séparés par des creux (ligne de cou ≈ 48), puis cassure basse.
const TRIPLE_TOP = seriesFromTargets([40, 46, 54, 48, 54, 48, 54, 46, 39]);
// Épaule-tête-épaule : épaules ≈ 54, tête ≈ 60, ligne de cou ≈ 49, cassure basse.
const HEAD_SHOULDERS = seriesFromTargets([44, 48, 54, 49, 60, 49, 54, 48, 42]);
// Épaule-tête-épaule inversé : miroir haussier (tête ≈ 44, cou ≈ 55).
const INVERSE_HEAD_SHOULDERS = seriesFromTargets([60, 56, 50, 55, 44, 55, 50, 56, 62]);
// Triangle ascendant : sommets plats (≈ 56), creux montants, cassure haute.
const ASCENDING_TRIANGLE = seriesFromTargets([48, 56, 50, 56, 52, 56, 54, 56, 60]);
// Triangle descendant : creux plats (≈ 48), sommets descendants, cassure basse.
const DESCENDING_TRIANGLE = seriesFromTargets([56, 48, 54, 48, 52, 48, 50, 48, 44]);
// Triangle symétrique : sommets descendants et creux montants qui convergent.
const SYMMETRICAL_TRIANGLE = seriesFromTargets([44, 56, 47, 54, 49, 52, 50, 51, 57]);
// Biseau ascendant : deux droites montantes convergentes, cassure basse (baissier).
const RISING_WEDGE = seriesFromTargets([46, 52, 49, 56, 52, 58, 55, 59, 50]);
// Biseau descendant : deux droites descendantes convergentes, cassure haute (haussier).
const FALLING_WEDGE = seriesFromTargets([60, 54, 57, 50, 52, 47, 49, 46, 55]);
// Drapeau haussier : mât montant, petit canal descendant, cassure haute.
const BULL_FLAG = seriesFromTargets([42, 44, 58, 55, 57, 54, 56, 53, 64]);
// Drapeau baissier : mât descendant, petit canal montant, cassure basse.
const BEAR_FLAG = seriesFromTargets([62, 60, 46, 49, 47, 50, 48, 51, 38]);
// Fanion haussier : mât montant puis convergence symétrique, cassure haute.
const BULLISH_PENNANT = seriesFromTargets([42, 58, 52, 56, 53, 55, 54, 61]);
// Fanion baissier : mât descendant puis convergence, cassure basse.
const BEARISH_PENNANT = seriesFromTargets([62, 46, 52, 48, 51, 49, 50, 39]);
// Rectangle haussier : oscillation entre deux plats (≈ 50 / ≈ 56), cassure haute.
const BULL_RECTANGLE = seriesFromTargets([44, 50, 56, 50, 56, 50, 56, 62]);
// Rectangle baissier : oscillation entre deux plats (≈ 48 / ≈ 54), cassure basse.
const BEAR_RECTANGLE = seriesFromTargets([60, 54, 48, 54, 48, 54, 48, 42]);
// Canal ascendant : deux droites parallèles montantes.
const ASCENDING_CHANNEL = seriesFromTargets([44, 50, 46, 54, 50, 58, 54, 62]);
// Canal descendant : deux droites parallèles descendantes.
const DESCENDING_CHANNEL = seriesFromTargets([62, 56, 60, 52, 56, 48, 52, 44]);
// Tasse avec anse : arrondi en « U », petite anse, cassure haute.
const CUP_HANDLE = seriesFromTargets([58, 52, 48, 46, 47, 50, 54, 57, 55, 53, 55, 62]);
// Fond arrondi : transition douce de baisse à hausse (« U »).
const ROUNDING_BOTTOM = seriesFromTargets([58, 53, 49, 46, 45, 46, 49, 53, 58, 62]);
// Sommet arrondi : transition douce de hausse à baisse (« ∩ »).
const ROUNDING_TOP = seriesFromTargets([42, 47, 51, 54, 55, 54, 51, 47, 42, 38]);

// ─── Structure & Smart Money Concepts (Lot 3) ────────────────────────
// Changement de caractère : tendance baissière (LH/LL) puis cassure au-dessus du dernier sommet inférieur.
const CHOCH = seriesFromTargets([60, 54, 57, 49, 52, 44, 48, 58]);
// Zone d'offre : rallye dans une zone haute puis rejet à la baisse.
const SUPPLY_ZONE = seriesFromTargets([44, 50, 56, 54, 50, 44, 40]);
// Zone de demande : baisse dans une zone basse puis rebond.
const DEMAND_ZONE = seriesFromTargets([60, 54, 48, 46, 50, 56, 60]);
// Order block : dernière bougie baissière avant une forte impulsion haussière.
const ORDER_BLOCK = seriesFromTargets([56, 52, 50, 58, 55, 62]);
// Fair value gap : trois bougies dont le haut de la 1re est sous le bas de la 3e (déséquilibre haussier).
const FAIR_VALUE_GAP: Candle[] = [
  { o: 46, h: 49, l: 45, c: 48.5 },
  { o: 49, h: 54, l: 48.8, c: 53.5 },
  { o: 53.5, h: 56, l: 52, c: 55.5 },
];
// Balayage de liquidité : deux hauts égaux, un pic au-dessus (sweep) puis retournement baissier.
const LIQUIDITY_SWEEP = seriesFromTargets([48, 55, 50, 55, 50, 58, 44]);
// Faux signal : franchissement bref d'une résistance puis retour sous le niveau.
const FAKEOUT = seriesFromTargets([46, 52, 55, 57, 52, 48, 50]);
// Cassure et retest : cassure d'un niveau, retour le tester, puis continuation.
const BREAK_RETEST = seriesFromTargets([46, 52, 55, 58, 55, 54, 60]);
// Accumulation (Wyckoff) : longue base en range puis sortie par le haut (markup).
const ACCUMULATION = seriesFromTargets([50, 52, 48, 51, 49, 52, 48, 51, 49, 52, 48, 56, 60]);
// Setup de gestion du risque : base puis progression (support pour l'entrée/stop/cible).
const RISK_SETUP = seriesFromTargets([50, 52, 48, 51, 49, 52, 55, 53, 57, 60, 58, 63]);
// Emballement parabolique (FOMO) : accélération puis essoufflement — « le prix s'envole ».
const PARABOLIC = seriesFromTargets([48, 49, 51, 54, 58, 63, 69, 66, 62]);

// ─── Séries pour indicateurs (Lot 4) ─────────────────────────────────
// Moyennes mobiles : hausse, repli, reprise → croisement rapide/lent visible.
const INDICATOR_MA = seriesFromTargets([44, 48, 46, 52, 50, 56, 54, 50, 48, 52, 56, 60, 58, 62]);
// Bollinger : compression (faible volatilité) puis expansion.
const INDICATOR_BOLLINGER = seriesFromTargets([50, 51, 50, 51, 50, 49, 50, 51, 56, 46, 58, 44, 60]);
// Fibonacci : impulsion haussière puis retracement.
const INDICATOR_FIB = seriesFromTargets([44, 48, 52, 58, 62, 58, 54, 56, 60]);
// RSI : montée en zone haute (>70) puis chute en zone basse (<30) puis reprise.
const INDICATOR_RSI = seriesFromTargets([50, 53, 56, 60, 63, 66, 64, 60, 55, 50, 46, 43, 41, 44, 48, 52]);
// MACD : tendance avec changement de momentum.
const INDICATOR_MACD = seriesFromTargets([46, 48, 47, 50, 49, 53, 52, 56, 55, 54, 52, 50, 51, 54, 57, 60]);
// Volume : bougies d'amplitudes variées.
const INDICATOR_VOLUME = seriesFromTargets([44, 50, 46, 56, 52, 60, 50, 58]);
// Divergence : le prix fait deux plus-hauts croissants (voir oscillateur en repli, en config).
const INDICATOR_DIVERGENCE: Candle[] = [
  { o: 48, h: 52, l: 47, c: 51 },
  { o: 51, h: 53, l: 49, c: 50 },
  { o: 50, h: 57, l: 49, c: 55 }, // plus-haut #1 (57)
  { o: 55, h: 56, l: 51, c: 52 },
  { o: 52, h: 54, l: 50, c: 53 },
  { o: 53, h: 61, l: 52, c: 59 }, // plus-haut #2 (61, plus haut)
  { o: 59, h: 60, l: 54, c: 55 },
];
// Golden cross : baisse puis reprise → la moyenne rapide repasse au-dessus de la lente.
const INDICATOR_GOLDEN_CROSS = seriesFromTargets([60, 56, 53, 51, 50, 52, 56, 60, 64, 68]);
// Death cross : hausse puis retournement → la moyenne rapide repasse sous la lente.
const INDICATOR_DEATH_CROSS = seriesFromTargets([40, 44, 47, 49, 50, 48, 44, 40, 36, 32]);
// Bollinger squeeze : compression très serrée puis expansion nette.
const INDICATOR_BOLLINGER_SQUEEZE = seriesFromTargets([50, 50.4, 50, 50.4, 50, 50.4, 50, 50.4, 50, 57, 44, 60]);
// Ruban de moyennes : tendance douce (plusieurs EMA empilées).
const INDICATOR_MA_RIBBON = seriesFromTargets([42, 45, 44, 48, 47, 52, 50, 55, 54, 60, 58, 64]);
// Stochastique : prix oscillant pour balayer suracheté/survendu.
const INDICATOR_STOCHASTIC = seriesFromTargets([50, 54, 58, 55, 50, 46, 44, 48, 54, 58, 54, 49, 45, 47, 52, 56]);
// VWAP : prix oscillant autour d'une moyenne pondérée.
const INDICATOR_VWAP = seriesFromTargets([48, 53, 50, 55, 49, 54, 50, 56, 51]);
// ATR : amplitudes croissantes (pic de volatilité) puis décroissantes.
const INDICATOR_ATR: Candle[] = [
  { o: 50, h: 51, l: 49, c: 50.5 },
  { o: 50.5, h: 52, l: 49.5, c: 51 },
  { o: 51, h: 55, l: 50, c: 54 },
  { o: 54, h: 60, l: 52, c: 58 },
  { o: 58, h: 66, l: 55, c: 62 },
  { o: 62, h: 65, l: 60, c: 61 },
  { o: 61, h: 63, l: 60, c: 62 },
  { o: 62, h: 63.5, l: 61, c: 62.5 },
];
// Divergence cachée (haussière) : le prix fait un creux plus haut, l'oscillateur un creux plus bas.
const INDICATOR_HIDDEN_DIV: Candle[] = [
  { o: 52, h: 54, l: 50, c: 51 },
  { o: 51, h: 52, l: 47, c: 49 }, // creux #1 (47)
  { o: 49, h: 56, l: 48, c: 55 },
  { o: 55, h: 58, l: 53, c: 54 },
  { o: 54, h: 56, l: 51, c: 52 }, // creux #2 (51, plus haut)
  { o: 52, h: 62, l: 51, c: 60 },
  { o: 60, h: 63, l: 58, c: 61 },
];

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
  // Figures chartistes (Lot 2)
  'pattern.triple-bottom.v1': TRIPLE_BOTTOM,
  'pattern.triple-top.v1': TRIPLE_TOP,
  'pattern.head-shoulders.v1': HEAD_SHOULDERS,
  'pattern.inverse-head-shoulders.v1': INVERSE_HEAD_SHOULDERS,
  'pattern.ascending-triangle.v1': ASCENDING_TRIANGLE,
  'pattern.descending-triangle.v1': DESCENDING_TRIANGLE,
  'pattern.symmetrical-triangle.v1': SYMMETRICAL_TRIANGLE,
  'pattern.rising-wedge.v1': RISING_WEDGE,
  'pattern.falling-wedge.v1': FALLING_WEDGE,
  'pattern.bull-flag.v1': BULL_FLAG,
  'pattern.bear-flag.v1': BEAR_FLAG,
  'pattern.bullish-pennant.v1': BULLISH_PENNANT,
  'pattern.bearish-pennant.v1': BEARISH_PENNANT,
  'pattern.bull-rectangle.v1': BULL_RECTANGLE,
  'pattern.bear-rectangle.v1': BEAR_RECTANGLE,
  'pattern.ascending-channel.v1': ASCENDING_CHANNEL,
  'pattern.descending-channel.v1': DESCENDING_CHANNEL,
  'pattern.cup-handle.v1': CUP_HANDLE,
  'pattern.rounding-bottom.v1': ROUNDING_BOTTOM,
  'pattern.rounding-top.v1': ROUNDING_TOP,
  // Structure & SMC (Lot 3)
  'structure.choch.v1': CHOCH,
  'structure.supply.v1': SUPPLY_ZONE,
  'structure.demand.v1': DEMAND_ZONE,
  'structure.order-block.v1': ORDER_BLOCK,
  'structure.fvg.v1': FAIR_VALUE_GAP,
  'structure.liquidity-sweep.v1': LIQUIDITY_SWEEP,
  'structure.fakeout.v1': FAKEOUT,
  'structure.break-retest.v1': BREAK_RETEST,
  'structure.accumulation.v1': ACCUMULATION,
  'structure.parabolic.v1': PARABOLIC,
  'risk.setup.v1': RISK_SETUP,
  // Indicateurs (Lot 4)
  'indicator.ma.v1': INDICATOR_MA,
  'indicator.bollinger.v1': INDICATOR_BOLLINGER,
  'indicator.fib.v1': INDICATOR_FIB,
  'indicator.rsi.v1': INDICATOR_RSI,
  'indicator.macd.v1': INDICATOR_MACD,
  'indicator.volume.v1': INDICATOR_VOLUME,
  'indicator.divergence.v1': INDICATOR_DIVERGENCE,
  // Indicateurs — extension Lot 4
  'indicator.golden-cross.v1': INDICATOR_GOLDEN_CROSS,
  'indicator.death-cross.v1': INDICATOR_DEATH_CROSS,
  'indicator.bollinger-squeeze.v1': INDICATOR_BOLLINGER_SQUEEZE,
  'indicator.ma-ribbon.v1': INDICATOR_MA_RIBBON,
  'indicator.stochastic.v1': INDICATOR_STOCHASTIC,
  'indicator.vwap.v1': INDICATOR_VWAP,
  'indicator.atr.v1': INDICATOR_ATR,
  'indicator.hidden-divergence.v1': INDICATOR_HIDDEN_DIV,
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
  'indicator',
  'risk-reward',
  'option-payoff',
] as const;
