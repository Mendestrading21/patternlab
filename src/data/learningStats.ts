/**
 * Compteurs d'apprentissage cumulatifs — logique pure, testable (aucune I/O).
 * Alimente les réussites « compréhension » V5 (exploration, diversité, faux signaux repérés)
 * et les statistiques. Ne récompense jamais un gain, un rendement ni la vitesse.
 */
import { emptyLearning, type LearningStats, type ProgressState } from './repositories';

/** Retourne les compteurs d'apprentissage (défaut vide si absents — états anciens/partiels). */
export function learningOf(state: ProgressState): LearningStats {
  return state.learning ?? emptyLearning();
}

/** Types d'exercices qui comptent comme « faux signal / invalidation » repéré. */
export const FALSE_SIGNAL_EXERCISE_TYPES = ['find_error', 'place_invalidation'] as const;

export function isFalseSignalExercise(type: string): boolean {
  return (FALSE_SIGNAL_EXERCISE_TYPES as readonly string[]).includes(type);
}

/** Enregistre un concept (et son monde) comme exploré. Idempotent : dédupliqué. Pur. */
export function addConceptExplored(state: ProgressState, slug: string, worldId?: string): ProgressState {
  const l = learningOf(state);
  const conceptsExplored = slug && !l.conceptsExplored.includes(slug) ? [...l.conceptsExplored, slug] : l.conceptsExplored;
  const worldsExplored = worldId && !l.worldsExplored.includes(worldId) ? [...l.worldsExplored, worldId] : l.worldsExplored;
  if (conceptsExplored === l.conceptsExplored && worldsExplored === l.worldsExplored) return state;
  return { ...state, learning: { ...l, conceptsExplored, worldsExplored } };
}

/** Incrémente le compteur de faux signaux repérés. Pur. */
export function addFalseSignalSpotted(state: ProgressState): ProgressState {
  const l = learningOf(state);
  return { ...state, learning: { ...l, falseSignalsSpotted: l.falseSignalsSpotted + 1 } };
}

/**
 * Enregistre le résultat d'une série de reconnaissance : ajoute les figures reconnues au cumul et
 * relève la meilleure série. Pur ; `recognized`/`bestStreak` négatifs ou non finis sont ignorés.
 */
export function addRecognitionResult(state: ProgressState, recognized: number, bestStreak: number): ProgressState {
  const l = learningOf(state);
  const add = Number.isFinite(recognized) && recognized > 0 ? Math.floor(recognized) : 0;
  const streak = Number.isFinite(bestStreak) && bestStreak > 0 ? Math.floor(bestStreak) : 0;
  const figuresRecognized = l.figuresRecognized + add;
  const bestRecognitionStreak = Math.max(l.bestRecognitionStreak, streak);
  if (figuresRecognized === l.figuresRecognized && bestRecognitionStreak === l.bestRecognitionStreak) return state;
  return { ...state, learning: { ...l, figuresRecognized, bestRecognitionStreak } };
}
