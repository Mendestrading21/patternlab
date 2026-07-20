/**
 * Modèle de contenu V5 — `LearningConcept` (pur, typé, sans I/O).
 *
 * Cœur de la montée en gamme visuelle-first : un concept ne se limite pas à une définition,
 * il porte reconnaissance, scénarios conditionnels, invalidation, faux signaux, visuel,
 * exemples de graphique, flashcards, mini-quiz et relations. Additif : la v1 (`GlossaryTerm`,
 * `SKILLS`) reste intacte ; `toGlossaryTerm`/`glossaryFromConcepts` fournissent un pont
 * non destructif pour alimenter l'écran glossaire depuis les concepts (bascule au Lot 4).
 *
 * Conformité (skill) : contenu éducatif, jamais prescriptif. Aucun BUY/SELL ni promesse de
 * gain — garanti par `conceptVocabularyIssues` et testé.
 */
import type { GlossaryTerm, GlossaryCategory } from './glossary';

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Direction = 'bullish' | 'bearish' | 'neutral';
export type Locale = 'fr-CH' | 'fr-FR';
export type ConceptStatus = 'imported' | 'draft' | 'needsReview' | 'approved' | 'published' | 'archived';

// ─── Mondes (15) — parcours macro de l'app ───────────────────────────
export interface World {
  id: string;
  order: number;
  title: string;
  subtitle: string;
}

export const WORLDS: World[] = [
  { id: 'world.foundations', order: 1, title: 'Fondations des marchés', subtitle: 'Ce qu’est un marché, un prix, un ordre.' },
  { id: 'world.anatomy', order: 2, title: 'Anatomie d’un graphique', subtitle: 'Axes, échelles, bougies, unités de temps.' },
  { id: 'world.candles', order: 3, title: 'Chandeliers japonais', subtitle: 'Lire une bougie et ses figures.' },
  { id: 'world.structure', order: 4, title: 'Tendances et structure', subtitle: 'HH/HL, impulsions, retracements, BOS.' },
  { id: 'world.support-resistance', order: 5, title: 'Supports et résistances', subtitle: 'Niveaux, zones, flips et retests.' },
  { id: 'world.patterns', order: 6, title: 'Figures chartistes', subtitle: 'Retournements et continuations.' },
  { id: 'world.indicators', order: 7, title: 'Indicateurs techniques', subtitle: 'Lecture, limites et divergences.' },
  { id: 'world.volume', order: 8, title: 'Volume et volume profile', subtitle: 'Participation, POC, VAH/VAL.' },
  { id: 'world.price-action', order: 9, title: 'Price action', subtitle: 'Comportement du prix sans indicateur.' },
  { id: 'world.risk', order: 10, title: 'Risk management', subtitle: 'Taille de position, invalidation, ruine.' },
  { id: 'world.psychology', order: 11, title: 'Psychologie et biais', subtitle: 'FOMO, discipline, pensée probabiliste.' },
  { id: 'world.smc', order: 12, title: 'Smart Money Concepts', subtitle: 'Liquidité, order blocks, FVG (éducatif).' },
  { id: 'world.wyckoff', order: 13, title: 'Wyckoff', subtitle: 'Accumulation, distribution, spring.' },
  { id: 'world.options', order: 14, title: 'Options et volatilité', subtitle: 'Notions éducatives, sans exécution.' },
  { id: 'world.false-signals', order: 15, title: 'Laboratoire de faux signaux', subtitle: 'Reconnaître ce qui invalide un scénario.' },
];

// ─── Catégories / familles (13) — taxonomie de contenu ───────────────
export interface Category {
  id: string;
  label: string;
  worldId: string;
  /** Volume cible (skill) — jamais publié d'un coup. */
  target: number;
}

export const CATEGORIES: Category[] = [
  { id: 'cat.foundations', label: 'Fondations et marchés', worldId: 'world.foundations', target: 45 },
  { id: 'cat.anatomy', label: 'Anatomie du graphique', worldId: 'world.anatomy', target: 35 },
  { id: 'cat.candles', label: 'Chandeliers japonais', worldId: 'world.candles', target: 75 },
  { id: 'cat.patterns', label: 'Figures chartistes et harmoniques', worldId: 'world.patterns', target: 90 },
  { id: 'cat.structure', label: 'Structure / price action', worldId: 'world.structure', target: 80 },
  { id: 'cat.volume', label: 'Volume / profile / order flow', worldId: 'world.volume', target: 65 },
  { id: 'cat.indicators', label: 'Indicateurs', worldId: 'world.indicators', target: 90 },
  { id: 'cat.smc', label: 'Smart Money Concepts', worldId: 'world.smc', target: 50 },
  { id: 'cat.wyckoff', label: 'Wyckoff', worldId: 'world.wyckoff', target: 50 },
  { id: 'cat.risk', label: 'Risk management', worldId: 'world.risk', target: 55 },
  { id: 'cat.psychology', label: 'Psychologie et processus', worldId: 'world.psychology', target: 55 },
  { id: 'cat.options', label: 'Options et volatilité', worldId: 'world.options', target: 65 },
  { id: 'cat.macro', label: 'Macro et intermarket', worldId: 'world.foundations', target: 50 },
];

// ─── Sous-objets ─────────────────────────────────────────────────────
export interface VisualLabel {
  text: string;
  at: string; // ancre logique (ex. 'body', 'upper-wick', 'neckline')
}
export interface VisualAnnotation {
  kind: 'zone' | 'line' | 'arrow' | 'note';
  text: string;
  direction?: Direction;
}
export interface VisualSpec {
  type:
    | 'candle-anatomy'
    | 'candlestick-pattern'
    | 'chart-pattern'
    | 'market-structure'
    | 'indicator'
    | 'risk-reward'
    | 'volume-profile'
    | 'comparison'
    | 'cheat-sheet';
  variant: string;
  direction?: Direction;
  labels: VisualLabel[];
  annotations: VisualAnnotation[];
  /** Clé de dataset OHLC déterministe (Lot 3). */
  datasetKey?: string;
  /** Alternative textuelle OBLIGATOIRE (accessibilité). */
  accessibilitySummary: string;
}
export interface ChartExample {
  datasetKey: string;
  caption: string;
  direction?: Direction;
}
export interface EducationalScenario {
  /** Conditions requises pour envisager ce scénario (jamais une certitude). */
  conditions: string[];
  /** Ce qui l'invalide. */
  invalidation: string;
}
export interface Flashcard {
  front: string;
  back: string;
}
export interface MiniQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
export interface ContentSource {
  label: string;
  kind: 'app' | 'wmb' | 'editorial' | 'external';
}

// ─── Concept ─────────────────────────────────────────────────────────
export interface LearningConcept {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  aliases: string[];
  categoryId: string;
  worldId: string;
  skillId?: string;
  difficulty: Difficulty;
  prerequisites: string[];
  tags: string[];
  learningObjective: string;
  definitionShort: string;
  definitionDetailed: string;
  howToRecognize: string[];
  contextRequired: string[];
  interpretationLimits: string[];
  bullishScenario?: EducationalScenario;
  bearishScenario?: EducationalScenario;
  neutralScenario?: EducationalScenario;
  confirmationZone?: string;
  invalidation?: string;
  falseSignals: string[];
  commonMistakes: string[];
  checklist: string[];
  visualSpec?: VisualSpec;
  chartExamples: ChartExample[];
  interactiveTemplates: string[];
  flashcards: Flashcard[];
  miniQuizzes: MiniQuiz[];
  relatedConceptIds: string[];
  sources: ContentSource[];
  sourcePath?: string;
  sourceHash?: string;
  version: number;
  status: ConceptStatus;
  locale: Locale;
  disclaimer: string;
}

export const DEFAULT_DISCLAIMER =
  'Contenu éducatif. Aucun conseil en investissement. Le trading comporte un risque de perte.';

// ─── Helpers purs ────────────────────────────────────────────────────
export const worldById = (id: string): World | undefined => WORLDS.find((w) => w.id === id);
export const categoryById = (id: string): Category | undefined => CATEGORIES.find((c) => c.id === id);
export const conceptById = (list: LearningConcept[], id: string) => list.find((c) => c.id === id);
export const conceptBySlug = (list: LearningConcept[], slug: string) => list.find((c) => c.slug === slug);
export const conceptsByCategory = (list: LearningConcept[], categoryId: string) =>
  list.filter((c) => c.categoryId === categoryId);
export const conceptsByWorld = (list: LearningConcept[], worldId: string) =>
  list.filter((c) => c.worldId === worldId);
export function relatedConcepts(list: LearningConcept[], concept: LearningConcept): LearningConcept[] {
  return concept.relatedConceptIds
    .map((id) => conceptById(list, id))
    .filter((c): c is LearningConcept => Boolean(c));
}

// ─── Garde de vocabulaire (conformité) ───────────────────────────────
/** Étiquettes prescriptives interdites (majuscules) + promesses (insensible à la casse). */
const FORBIDDEN_UPPER = ['BUY', 'SELL'];
const FORBIDDEN_PHRASES = [
  'profit garanti',
  'gain garanti',
  'rendement garanti',
  'signal sûr',
  'trade gagnant',
  'liberté financière garantie',
];

/**
 * Garde de vocabulaire générique : retourne les violations dans une liste de textes.
 * Source unique de vérité réutilisée par les concepts ET la bibliothèque de visuels.
 */
export function vocabularyIssuesIn(texts: string[]): string[] {
  const issues: string[] = [];
  for (const t of texts) {
    for (const up of FORBIDDEN_UPPER) {
      if (new RegExp(`\\b${up}\\b`).test(t)) issues.push(`${up} interdit : « ${t.slice(0, 60)} »`);
    }
    const lower = t.toLowerCase();
    for (const p of FORBIDDEN_PHRASES) {
      if (lower.includes(p)) issues.push(`« ${p} » interdit : « ${t.slice(0, 60)} »`);
    }
  }
  return issues;
}

function conceptText(c: LearningConcept): string[] {
  return [
    c.title,
    c.learningObjective,
    c.definitionShort,
    c.definitionDetailed,
    ...c.howToRecognize,
    ...c.contextRequired,
    ...c.interpretationLimits,
    ...c.falseSignals,
    ...c.commonMistakes,
    ...c.checklist,
    c.confirmationZone ?? '',
    c.invalidation ?? '',
    ...c.flashcards.flatMap((f) => [f.front, f.back]),
    ...c.miniQuizzes.flatMap((q) => [q.question, ...q.options, q.explanation]),
    c.visualSpec?.accessibilitySummary ?? '',
  ];
}

/** Retourne les violations de vocabulaire (vide = conforme). */
export function conceptVocabularyIssues(c: LearningConcept): string[] {
  return vocabularyIssuesIn(conceptText(c));
}

// ─── Intégrité d'un corpus ───────────────────────────────────────────
export interface IntegrityContext {
  skillIds: Set<string>;
}
export interface IntegrityIssue {
  conceptId: string;
  problem: string;
}

export function checkConceptsIntegrity(list: LearningConcept[], ctx: IntegrityContext): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const worldIds = new Set(WORLDS.map((w) => w.id));
  const catIds = new Set(CATEGORIES.map((c) => c.id));
  const allIds = new Set(list.map((c) => c.id));

  for (const c of list) {
    if (ids.has(c.id)) issues.push({ conceptId: c.id, problem: 'id dupliqué' });
    if (slugs.has(c.slug)) issues.push({ conceptId: c.id, problem: `slug dupliqué : ${c.slug}` });
    ids.add(c.id);
    slugs.add(c.slug);
    if (!worldIds.has(c.worldId)) issues.push({ conceptId: c.id, problem: `world inconnu : ${c.worldId}` });
    if (!catIds.has(c.categoryId)) issues.push({ conceptId: c.id, problem: `catégorie inconnue : ${c.categoryId}` });
    if (c.skillId && !ctx.skillIds.has(c.skillId)) issues.push({ conceptId: c.id, problem: `skill inconnu : ${c.skillId}` });
    if (!c.disclaimer.trim()) issues.push({ conceptId: c.id, problem: 'disclaimer manquant' });
    if (c.visualSpec && !c.visualSpec.accessibilitySummary.trim()) {
      issues.push({ conceptId: c.id, problem: 'VisualSpec sans résumé accessible' });
    }
    for (const rel of c.relatedConceptIds) {
      if (rel === c.id) issues.push({ conceptId: c.id, problem: 'relation auto-référente' });
      else if (!allIds.has(rel)) issues.push({ conceptId: c.id, problem: `relation cassée : ${rel}` });
    }
    for (const pre of c.prerequisites) {
      if (!allIds.has(pre)) issues.push({ conceptId: c.id, problem: `prérequis cassé : ${pre}` });
    }
    issues.push(...conceptVocabularyIssues(c).map((problem) => ({ conceptId: c.id, problem })));
  }
  return issues;
}

// ─── Pont non destructif vers GlossaryTerm (Lot 4 basculera l'écran) ──
/** Mappe une catégorie V5 vers une catégorie de glossaire v1 (vue dérivée). */
const V5_TO_GLOSSARY_CATEGORY: Record<string, GlossaryCategory> = {
  'cat.foundations': 'marche',
  'cat.macro': 'marche',
  'cat.anatomy': 'analyse',
  'cat.structure': 'analyse',
  'cat.patterns': 'analyse',
  'cat.candles': 'analyse',
  'cat.indicators': 'indicateur',
  'cat.volume': 'indicateur',
  'cat.risk': 'risque',
  'cat.psychology': 'risque',
  'cat.smc': 'strategie',
  'cat.wyckoff': 'strategie',
  'cat.options': 'strategie',
};

/**
 * Mappe un concept vers un `GlossaryTerm` (vue dérivée). `related` (slugs) est résolu si la
 * table id→slug est fournie ; sinon laissé vide (résolu par `glossaryFromConcepts`).
 */
export function toGlossaryTerm(c: LearningConcept, slugById?: Map<string, string>): GlossaryTerm {
  const related = slugById
    ? c.relatedConceptIds.map((id) => slugById.get(id)).filter((s): s is string => Boolean(s))
    : [];
  return {
    slug: c.slug,
    term: c.title,
    english: c.aliases[0] ?? c.shortTitle,
    category: V5_TO_GLOSSARY_CATEGORY[c.categoryId] ?? 'marche',
    summary: c.definitionShort,
    definition: c.definitionDetailed,
    example: c.chartExamples[0]?.caption,
    relatedSkillId: c.skillId,
    related: related.length ? related : undefined,
  };
}

export function glossaryFromConcepts(list: LearningConcept[]): GlossaryTerm[] {
  const visible = list.filter((c) => c.status !== 'archived');
  const slugById = new Map(visible.map((c) => [c.id, c.slug]));
  return visible.map((c) => toGlossaryTerm(c, slugById));
}
