/**
 * Moteur d'exercices — les 12 formats du kit (reference + schemas/exercise.schema.json).
 * P0.1 implémente `mcq` et `true_false` ; les autres sont déclarés puis branchés par lot.
 */

export type ExerciseType =
  | 'mcq'
  | 'true_false'
  | 'match'
  | 'order'
  | 'drag_drop'
  | 'select_chart_zone'
  | 'draw_level'
  | 'identify_pattern'
  | 'find_error'
  | 'scenario'
  | 'numeric'
  | 'timed'
  // Formats graphiques V5 (Lot 6)
  | 'place_invalidation'
  | 'label_chart'
  | 'sequence_market_structure';

export const ALL_EXERCISE_TYPES: ExerciseType[] = [
  'mcq',
  'true_false',
  'match',
  'order',
  'drag_drop',
  'select_chart_zone',
  'draw_level',
  'identify_pattern',
  'find_error',
  'scenario',
  'numeric',
  'timed',
  'place_invalidation',
  'label_chart',
  'sequence_market_structure',
];

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

/** Feedback obligatoire : pourquoi c'est correct, pourquoi c'est faux, la règle, et quand elle échoue. */
export interface ExerciseFeedback {
  correct: string;
  incorrect: string;
  rule?: string;
  whenItFails?: string;
}

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  skillId: string;
  prompt: string;
  difficulty?: ExerciseDifficulty;
  feedback: ExerciseFeedback;
  sources?: string[];
}

export interface McqExercise extends BaseExercise {
  type: 'mcq';
  options: string[];
  validation: { correctIndex: number };
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true_false';
  validation: { answer: boolean };
}

export interface NumericExercise extends BaseExercise {
  type: 'numeric';
  unit?: string;
  validation: { answer: number; tolerance?: number };
}

export interface OrderExercise extends BaseExercise {
  type: 'order';
  items: string[];
  /** correctOrder = indices de `items` dans le bon ordre. */
  validation: { correctOrder: number[] };
}

export interface MatchExercise extends BaseExercise {
  type: 'match';
  left: string[];
  right: string[];
  /** matches[i] = index dans `right` associé à left[i]. */
  validation: { matches: number[] };
}

export interface FindErrorExercise extends BaseExercise {
  type: 'find_error';
  statements: string[];
  /** Index de l'affirmation ERRONÉE à repérer. */
  validation: { errorIndex: number };
}

export interface IdentifyPatternExercise extends BaseExercise {
  type: 'identify_pattern';
  /** Seed de la série de bougies à afficher (reproductible). */
  chartSeed: number;
  options: string[];
  validation: { correctIndex: number };
}

/** Scénario conditionnel (SI … / ALORS …). */
export interface ScenarioExercise extends BaseExercise {
  type: 'scenario';
  /** Le « SI » : le setup/contexte à évaluer. */
  context: string;
  /** Les issues possibles (« ALORS »). */
  options: string[];
  validation: { correctIndex: number };
}

/** Sélection d'une zone du graphique (gauche→droite). */
export interface SelectChartZoneExercise extends BaseExercise {
  type: 'select_chart_zone';
  chartSeed: number;
  /** Libellés des zones, de gauche à droite (servent aussi de repère accessible). */
  zones: string[];
  validation: { correctZone: number };
}

/**
 * Placer un niveau d'invalidation (prix) sur le graphique.
 * La réponse est un prix ; correcte si dans la tolérance absolue autour de la cible.
 */
export interface PlaceInvalidationExercise extends BaseExercise {
  type: 'place_invalidation';
  chartSeed: number;
  /** Repère textuel (ex. « sous le second creux ») — sens attendu, accessible. */
  hint?: string;
  validation: { targetPrice: number; tolerance: number };
}

/** Étiqueter un élément mis en évidence sur le graphique (bougie marquée par un repère). */
export interface LabelChartExercise extends BaseExercise {
  type: 'label_chart';
  chartSeed: number;
  /** Index de la bougie mise en évidence (0-based) dans la série de 30. */
  markerIndex: number;
  options: string[];
  validation: { correctIndex: number };
}

/** Reconstituer l'ordre d'une séquence de structure de marché (range → cassure → pullback…). */
export interface SequenceMarketStructureExercise extends BaseExercise {
  type: 'sequence_market_structure';
  /** Étapes à ordonner. */
  steps: string[];
  /** Seed d'un graphique d'illustration (optionnel). */
  chartSeed?: number;
  /** correctOrder = indices de `steps` dans le bon ordre. */
  validation: { correctOrder: number[] };
}

/** Union discriminée des formats implémentés (narrowing par `type`). */
export type Exercise =
  | McqExercise
  | TrueFalseExercise
  | NumericExercise
  | OrderExercise
  | MatchExercise
  | FindErrorExercise
  | IdentifyPatternExercise
  | ScenarioExercise
  | SelectChartZoneExercise
  | PlaceInvalidationExercise
  | LabelChartExercise
  | SequenceMarketStructureExercise;

export interface GradeResult {
  correct: boolean;
  feedback: ExerciseFeedback;
}
