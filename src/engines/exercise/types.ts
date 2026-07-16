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

export type Exercise = McqExercise | TrueFalseExercise | BaseExercise;

export interface GradeResult {
  correct: boolean;
  feedback: ExerciseFeedback;
}
