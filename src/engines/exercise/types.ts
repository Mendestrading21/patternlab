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
  | 'timed';

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

/** Union discriminée des formats implémentés (narrowing par `type`). */
export type Exercise =
  | McqExercise
  | TrueFalseExercise
  | NumericExercise
  | OrderExercise
  | MatchExercise
  | FindErrorExercise
  | IdentifyPatternExercise;

export interface GradeResult {
  correct: boolean;
  feedback: ExerciseFeedback;
}
