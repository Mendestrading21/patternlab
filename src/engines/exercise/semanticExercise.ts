/**
 * Source sémantique unique d'un exercice directionnel.
 *
 * Le problème historique : un graphique était rendu depuis `chartSeed`, mais la
 * bonne réponse, le feedback et le texte accessible étaient écrits À LA MAIN —
 * d'où des contradictions possibles (chart baissier, réponse « haussière »).
 *
 * Ici, la direction est calculée UNE fois depuis la série réellement affichée
 * (`generateCandles(seed, count)` → `candleTrend`), puis la réponse correcte, le
 * feedback ET le résumé accessible en dérivent. Graphique, réponse, feedback et
 * accessibilité partagent donc une seule vérité — par construction.
 */
import { generateCandles } from '../pattern/demoChart';
import { candleTrend, describeCandles, type CandleTrend } from '../pattern/chartA11y';
import type { ExerciseDifficulty, ExerciseFeedback, ExerciseTarget, IdentifyPatternExercise } from './types';

/** Nombre de bougies rendu par `ExercisePlayer` pour un `identify_pattern`. */
export const DIRECTION_CANDLE_COUNT = 30;

/** Index de l'option correcte selon la tendance (ordre des options : [hausse, baisse, latéral]). */
const TREND_INDEX: Record<CandleTrend, 0 | 1 | 2> = {
  haussière: 0,
  baissière: 1,
  latérale: 2,
};

export interface DirectionExerciseSpec {
  id: string;
  skillId: string;
  chartSeed: number;
  /** Cible pédagogique (conceptId + objectiveId). */
  target: ExerciseTarget;
  prompt: string;
  /** Libellés des 3 options, TOUJOURS dans l'ordre [hausse, baisse, latéral]. */
  options: [string, string, string];
  difficulty?: ExerciseDifficulty;
  /** Nuance pédagogique optionnelle (règle générale) — indépendante de la direction. */
  rule?: string;
  /** Mise en garde optionnelle (faux signal) — indépendante de la direction. */
  whenItFails?: string;
}

/**
 * Construit un exercice `identify_pattern` cohérent par construction : la réponse
 * correcte, le feedback et le résumé accessible dérivent tous de la MÊME série.
 */
export function buildDirectionExercise(spec: DirectionExerciseSpec): IdentifyPatternExercise {
  const candles = generateCandles(spec.chartSeed, DIRECTION_CANDLE_COUNT);
  const trend = candleTrend(candles);
  const correctIndex = TREND_INDEX[trend];
  const summary = describeCandles(candles);

  const feedback: ExerciseFeedback = {
    correct: `Bien vu : la structure d'ensemble est ${trend}. ${summary}`,
    incorrect: `Lis la structure globale plutôt qu'une seule bougie : elle est ${trend}. ${summary}`,
    rule: spec.rule ?? 'La tendance se lit sur la structure globale (l’enchaînement des bougies), jamais sur une seule.',
    whenItFails: spec.whenItFails ?? 'Une seule bougie ne fait pas la tendance : c’est l’ensemble qui compte.',
  };

  return {
    id: spec.id,
    type: 'identify_pattern',
    skillId: spec.skillId,
    target: spec.target,
    prompt: spec.prompt,
    chartSeed: spec.chartSeed,
    options: [...spec.options],
    validation: { correctIndex },
    difficulty: spec.difficulty ?? 'easy',
    feedback,
  };
}
