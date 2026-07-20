/**
 * Bibliothèque visuelle — catalogue de figures illustrées en code (pur, typé, sans I/O).
 *
 * Objectif : donner un « signal visuel » à chaque figure du vocabulaire (chandeliers, structure,
 * figures chartistes). Chaque glyphe pointe vers un dataset OHLC déterministe du moteur de visuels
 * et fournit une alternative textuelle accessible. Les schémas sont ORIGINAUX, générés par le moteur
 * SVG — aucune image externe, aucune capture, aucune copie de références.
 *
 * Conformité : éducatif, jamais prescriptif ; aucun BUY/SELL ni promesse — garanti par test via
 * `patternLibraryVocabularyIssues` (réutilise la garde de vocabulaire des concepts).
 */
import { vocabularyIssuesIn, type Direction, type VisualSpec } from './learningConcept';

export type PatternFamily = 'chandelier-simple' | 'chandelier-double' | 'chandelier-triple' | 'structure';

export interface FamilyMeta {
  id: PatternFamily;
  order: number;
  title: string;
  subtitle: string;
}

/** Familles ordonnées (en-têtes de la galerie). */
export const PATTERN_FAMILIES: FamilyMeta[] = [
  { id: 'chandelier-simple', order: 1, title: 'Chandeliers — une bougie', subtitle: 'Marteau, doji, marubozu… la brique de base.' },
  { id: 'chandelier-double', order: 2, title: 'Chandeliers — deux bougies', subtitle: 'Avalements, harami, pincettes…' },
  { id: 'chandelier-triple', order: 3, title: 'Chandeliers — trois bougies', subtitle: 'Étoiles, soldats et corbeaux.' },
  { id: 'structure', order: 4, title: 'Structure & figures', subtitle: 'Tendances, cassures, doubles et zones.' },
];

export interface PatternGlyph {
  id: string;
  /** Titre affiché (FR). */
  title: string;
  /** Nom anglais usuel (repère pédagogique). */
  aliasEn: string;
  family: PatternFamily;
  /** Type de rendu du moteur de visuels. */
  visualType: VisualSpec['type'];
  direction: Direction;
  /** Clé du dataset OHLC déterministe. */
  datasetKey: string;
  /** Étiquettes courtes (puces). */
  labels: string[];
  /** Alternative textuelle OBLIGATOIRE (accessibilité). */
  summary: string;
}

/**
 * Catalogue. Chaque entrée est rendable par `VisualCard` via `glyphToVisualSpec`.
 * Les glyphes de structure/figures utilisent `chart-pattern` (bougies nues) sauf les zones
 * (support/résistance, range) qui utilisent `market-structure`.
 */
export const PATTERN_LIBRARY: PatternGlyph[] = [
  // ─── Chandeliers simples ───────────────────────────────────────────
  {
    id: 'hammer', title: 'Marteau', aliasEn: 'Hammer', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.hammer.v1',
    labels: ['petit corps haut', 'longue mèche basse'],
    summary: 'Petit corps en haut et longue mèche basse : un rejet des prix bas, à interpréter après une baisse.',
  },
  {
    id: 'hanging-man', title: 'Pendu', aliasEn: 'Hanging Man', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.hanging-man.v1',
    labels: ['petit corps haut', 'longue mèche basse'],
    summary: 'Même forme que le marteau mais après une hausse : la longue mèche basse traduit une hésitation en haut de tendance.',
  },
  {
    id: 'inverted-hammer', title: 'Marteau inversé', aliasEn: 'Inverted Hammer', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.inverted-hammer.v1',
    labels: ['petit corps bas', 'longue mèche haute'],
    summary: 'Petit corps en bas et longue mèche haute, après une baisse : tentative de rejet vers le haut, à confirmer.',
  },
  {
    id: 'doji', title: 'Doji', aliasEn: 'Doji', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'neutral', datasetKey: 'candle.doji.v1',
    labels: ['corps minuscule', 'mèches équilibrées'],
    summary: 'Ouverture et clôture quasi identiques : une indécision entre acheteurs et vendeurs.',
  },
  {
    id: 'dragonfly-doji', title: 'Doji libellule', aliasEn: 'Dragonfly Doji', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.dragonfly-doji.v1',
    labels: ['corps en haut', 'longue mèche basse'],
    summary: 'Doji dont l’ouverture et la clôture sont en haut, avec une longue mèche basse : rejet marqué des prix bas.',
  },
  {
    id: 'gravestone-doji', title: 'Doji pierre tombale', aliasEn: 'Gravestone Doji', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.gravestone-doji.v1',
    labels: ['corps en bas', 'longue mèche haute'],
    summary: 'Doji dont l’ouverture et la clôture sont en bas, avec une longue mèche haute : rejet marqué des prix hauts.',
  },
  {
    id: 'spinning-top', title: 'Toupie', aliasEn: 'Spinning Top', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'neutral', datasetKey: 'candle.spinning-top.v1',
    labels: ['petit corps centré', 'deux mèches'],
    summary: 'Petit corps au centre avec des mèches des deux côtés : un équilibre incertain, sans vainqueur net.',
  },
  {
    id: 'shooting-star', title: 'Étoile filante', aliasEn: 'Shooting Star', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.shooting-star.v1',
    labels: ['petit corps bas', 'longue mèche haute'],
    summary: 'Petit corps en bas et longue mèche haute, après une hausse : un rejet des prix hauts, miroir du marteau.',
  },
  {
    id: 'bullish-marubozu', title: 'Marubozu haussier', aliasEn: 'Bullish Marubozu', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.bullish-marubozu.v1',
    labels: ['grand corps', 'sans mèche'],
    summary: 'Grande bougie haussière sans mèche : les acheteurs ont dominé toute la période.',
  },
  {
    id: 'bearish-marubozu', title: 'Marubozu baissier', aliasEn: 'Bearish Marubozu', family: 'chandelier-simple',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.bearish-marubozu.v1',
    labels: ['grand corps', 'sans mèche'],
    summary: 'Grande bougie baissière sans mèche : les vendeurs ont dominé toute la période.',
  },

  // ─── Chandeliers doubles ───────────────────────────────────────────
  {
    id: 'bullish-engulfing', title: 'Avalement haussier', aliasEn: 'Bullish Engulfing', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.bullish-engulfing.v1',
    labels: ['bougie englobée', 'bougie englobante'],
    summary: 'Une petite bougie baissière puis une grande haussière dont le corps recouvre le précédent : reprise des acheteurs.',
  },
  {
    id: 'bearish-engulfing', title: 'Avalement baissier', aliasEn: 'Bearish Engulfing', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.bearish-engulfing.v1',
    labels: ['bougie englobée', 'bougie englobante'],
    summary: 'Une petite bougie haussière puis une grande baissière dont le corps recouvre le précédent : reprise des vendeurs.',
  },
  {
    id: 'bullish-harami', title: 'Harami haussier', aliasEn: 'Bullish Harami', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.bullish-harami.v1',
    labels: ['grand corps baissier', 'petit corps contenu'],
    summary: 'Une grande bougie baissière puis un petit corps contenu à l’intérieur : la baisse marque une pause.',
  },
  {
    id: 'bearish-harami', title: 'Harami baissier', aliasEn: 'Bearish Harami', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.bearish-harami.v1',
    labels: ['grand corps haussier', 'petit corps contenu'],
    summary: 'Une grande bougie haussière puis un petit corps contenu à l’intérieur : la hausse marque une pause.',
  },
  {
    id: 'piercing-line', title: 'Ligne de perce', aliasEn: 'Piercing Line', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.piercing-line.v1',
    labels: ['bougie baissière', 'clôture au-dessus du milieu'],
    summary: 'Après une bougie baissière, une bougie haussière clôture au-dessus du milieu du corps précédent : reprise partielle.',
  },
  {
    id: 'dark-cloud-cover', title: 'Couverture en nuage', aliasEn: 'Dark Cloud Cover', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.dark-cloud-cover.v1',
    labels: ['bougie haussière', 'clôture sous le milieu'],
    summary: 'Après une bougie haussière, une bougie baissière clôture sous le milieu du corps précédent : essoufflement.',
  },
  {
    id: 'tweezer-top', title: 'Pincettes hautes', aliasEn: 'Tweezer Top', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.tweezer-top.v1',
    labels: ['plus-hauts identiques'],
    summary: 'Deux bougies au même plus-haut : un plafond rejeté deux fois de suite.',
  },
  {
    id: 'tweezer-bottom', title: 'Pincettes basses', aliasEn: 'Tweezer Bottom', family: 'chandelier-double',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.tweezer-bottom.v1',
    labels: ['plus-bas identiques'],
    summary: 'Deux bougies au même plus-bas : un plancher rejeté deux fois de suite.',
  },

  // ─── Chandeliers triples ───────────────────────────────────────────
  {
    id: 'morning-star', title: 'Étoile du matin', aliasEn: 'Morning Star', family: 'chandelier-triple',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.morning-star.v1',
    labels: ['baissière', 'étoile', 'haussière'],
    summary: 'Trois bougies : une baissière, une petite étoile d’indécision, puis une haussière : bascule progressive vers le haut.',
  },
  {
    id: 'evening-star', title: 'Étoile du soir', aliasEn: 'Evening Star', family: 'chandelier-triple',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.evening-star.v1',
    labels: ['haussière', 'étoile', 'baissière'],
    summary: 'Trois bougies : une haussière, une petite étoile d’indécision, puis une baissière : bascule progressive vers le bas.',
  },
  {
    id: 'three-white-soldiers', title: 'Trois soldats blancs', aliasEn: 'Three White Soldiers', family: 'chandelier-triple',
    visualType: 'candlestick-pattern', direction: 'bullish', datasetKey: 'candle.three-white-soldiers.v1',
    labels: ['trois haussières', 'clôtures montantes'],
    summary: 'Trois bougies haussières successives aux clôtures de plus en plus hautes : une poussée régulière des acheteurs.',
  },
  {
    id: 'three-black-crows', title: 'Trois corbeaux noirs', aliasEn: 'Three Black Crows', family: 'chandelier-triple',
    visualType: 'candlestick-pattern', direction: 'bearish', datasetKey: 'candle.three-black-crows.v1',
    labels: ['trois baissières', 'clôtures descendantes'],
    summary: 'Trois bougies baissières successives aux clôtures de plus en plus basses : une pression régulière des vendeurs.',
  },

  // ─── Structure & figures ───────────────────────────────────────────
  {
    id: 'uptrend', title: 'Tendance haussière', aliasEn: 'Uptrend', family: 'structure',
    visualType: 'chart-pattern', direction: 'bullish', datasetKey: 'structure.uptrend.v1',
    labels: ['higher highs', 'higher lows'],
    summary: 'Une série de sommets et de creux de plus en plus hauts (HH/HL) : la structure d’une tendance haussière.',
  },
  {
    id: 'downtrend', title: 'Tendance baissière', aliasEn: 'Downtrend', family: 'structure',
    visualType: 'chart-pattern', direction: 'bearish', datasetKey: 'structure.downtrend.v1',
    labels: ['lower highs', 'lower lows'],
    summary: 'Une série de sommets et de creux de plus en plus bas (LH/LL) : la structure d’une tendance baissière.',
  },
  {
    id: 'break-of-structure', title: 'Cassure de structure', aliasEn: 'Break of Structure', family: 'structure',
    visualType: 'chart-pattern', direction: 'bearish', datasetKey: 'structure.bos.v1',
    labels: ['séquence HH/HL', 'rupture'],
    summary: 'Une progression haussière qui se rompt quand le prix casse sous le dernier creux protégé.',
  },
  {
    id: 'support-resistance', title: 'Support & résistance', aliasEn: 'Support & Resistance', family: 'structure',
    visualType: 'market-structure', direction: 'neutral', datasetKey: 'structure.support-resistance.v1',
    labels: ['résistance', 'support'],
    summary: 'Deux zones horizontales encadrant le prix : un plancher (support) et un plafond (résistance).',
  },
  {
    id: 'range', title: 'Range', aliasEn: 'Range', family: 'structure',
    visualType: 'market-structure', direction: 'neutral', datasetKey: 'structure.support-resistance.v1',
    labels: ['zone d’équilibre'],
    summary: 'Le prix oscille entre un support et une résistance, sans direction nette : une phase d’équilibre.',
  },
  {
    id: 'double-bottom', title: 'Double creux', aliasEn: 'Double Bottom', family: 'structure',
    visualType: 'chart-pattern', direction: 'bullish', datasetKey: 'pattern.double-bottom.v1',
    labels: ['creux 1', 'creux 2', 'ligne de cou'],
    summary: 'Deux creux à un niveau proche séparés par un sommet (« W ») ; le franchissement du sommet confirme la figure.',
  },
  {
    id: 'double-top', title: 'Double sommet', aliasEn: 'Double Top', family: 'structure',
    visualType: 'chart-pattern', direction: 'bearish', datasetKey: 'pattern.double-top.v1',
    labels: ['sommet 1', 'sommet 2', 'ligne de cou'],
    summary: 'Deux sommets à un niveau proche séparés par un creux (« M ») ; la cassure du creux confirme la figure.',
  },
];

// ─── Helpers purs ────────────────────────────────────────────────────
/** Construit un `VisualSpec` rendable par `VisualCard` à partir d’un glyphe. */
export function glyphToVisualSpec(g: PatternGlyph): VisualSpec {
  return {
    type: g.visualType,
    variant: g.id,
    direction: g.direction,
    labels: g.labels.map((text) => ({ text, at: 'body' })),
    annotations: [],
    datasetKey: g.datasetKey,
    accessibilitySummary: g.summary,
  };
}

export const glyphById = (id: string): PatternGlyph | undefined => PATTERN_LIBRARY.find((g) => g.id === id);

export function glyphsByFamily(family: PatternFamily): PatternGlyph[] {
  return PATTERN_LIBRARY.filter((g) => g.family === family);
}

// ─── Intégrité & conformité (testées) ────────────────────────────────
export interface PatternLibraryIssue {
  glyphId: string;
  problem: string;
}

const FAMILY_IDS = new Set<PatternFamily>(PATTERN_FAMILIES.map((f) => f.id));

/** Intégrité structurelle : ids uniques, famille connue, résumé/dataset présents. */
export function patternLibraryIntegrity(list: PatternGlyph[] = PATTERN_LIBRARY): PatternLibraryIssue[] {
  const issues: PatternLibraryIssue[] = [];
  const ids = new Set<string>();
  for (const g of list) {
    if (ids.has(g.id)) issues.push({ glyphId: g.id, problem: 'id dupliqué' });
    ids.add(g.id);
    if (!FAMILY_IDS.has(g.family)) issues.push({ glyphId: g.id, problem: `famille inconnue : ${g.family}` });
    if (!g.title.trim()) issues.push({ glyphId: g.id, problem: 'titre manquant' });
    if (!g.summary.trim()) issues.push({ glyphId: g.id, problem: 'résumé accessible manquant' });
    if (!g.datasetKey.trim()) issues.push({ glyphId: g.id, problem: 'datasetKey manquant' });
  }
  return issues;
}

/** Garde de vocabulaire : aucun BUY/SELL ni promesse dans les textes visibles. */
export function patternLibraryVocabularyIssues(list: PatternGlyph[] = PATTERN_LIBRARY): string[] {
  return vocabularyIssuesIn(list.flatMap((g) => [g.title, g.aliasEn, g.summary, ...g.labels]));
}
