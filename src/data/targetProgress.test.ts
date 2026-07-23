import { describe, it, expect } from '@jest/globals';
import {
  applyTargetSessionResults,
  initialTargetProgress,
  isObjectiveProven,
  isObjectiveTrained,
  objectiveCoverage,
  MASTERY_MIN_REPS,
  type TargetProgress,
} from './targetProgress';

const T0 = 1_700_000_000_000;
const DAY = 86_400_000;

const OBJ_A = 'concept.x::recognize';
const OBJ_B = 'concept.x::interpret';

describe('targetProgress — progression par cible', () => {
  it('une session applique UNE transition par cible (répétitions 0 → 1)', () => {
    const after = applyTargetSessionResults({}, [{ objectiveId: OBJ_A, conceptId: 'concept.x', correct: 5, total: 5 }], T0);
    expect(after[OBJ_A].review.repetitions).toBe(1);
    expect(after[OBJ_A].attempts).toBe(5);
    expect(after[OBJ_A].correct).toBe(5);
    expect(after[OBJ_A].sessions).toBe(1);
    expect(after[OBJ_A].lastCorrect).toBe(true);
  });

  it('deux objectifs d’un même concept avancent INDÉPENDAMMENT', () => {
    const after = applyTargetSessionResults(
      {},
      [
        { objectiveId: OBJ_A, conceptId: 'concept.x', correct: 5, total: 5 }, // réussi
        { objectiveId: OBJ_B, conceptId: 'concept.x', correct: 1, total: 5 }, // échoué
      ],
      T0,
    );
    expect(after[OBJ_A].review.repetitions).toBe(1);
    expect(after[OBJ_B].review.repetitions).toBe(0); // échec → pas d'avancée
    expect(after[OBJ_A]).not.toEqual(after[OBJ_B]);
  });

  it('cinq réponses d’une session = une seule transition (pas cinq rappels)', () => {
    // L'appelant agrège d'abord : 5 bonnes réponses → un seul résultat {correct:5,total:5}.
    const after = applyTargetSessionResults({}, [{ objectiveId: OBJ_A, conceptId: 'concept.x', correct: 5, total: 5 }], T0);
    expect(after[OBJ_A].review.repetitions).toBe(1);
  });

  it('deux sessions distinctes cumulent deux transitions', () => {
    let s = applyTargetSessionResults({}, [{ objectiveId: OBJ_A, conceptId: 'concept.x', correct: 5, total: 5 }], T0);
    s = applyTargetSessionResults(s, [{ objectiveId: OBJ_A, conceptId: 'concept.x', correct: 5, total: 5 }], s[OBJ_A].review.dueAt);
    expect(s[OBJ_A].review.repetitions).toBe(2);
    expect(s[OBJ_A].sessions).toBe(2);
    expect(s[OBJ_A].review.intervalDays).toBeGreaterThanOrEqual(1);
  });

  it('ignore un résultat sans total (pas de division par zéro, pas d’effet)', () => {
    const after = applyTargetSessionResults({}, [{ objectiveId: OBJ_A, conceptId: 'concept.x', correct: 0, total: 0 }], T0);
    expect(after[OBJ_A]).toBeUndefined();
  });

  it('isObjectiveProven exige succès + rétention (reps ≥ min, intervalle ≥ 1)', () => {
    const trainedOnce = initialTargetProgress(OBJ_A, 'concept.x', T0);
    expect(isObjectiveTrained(trainedOnce)).toBe(false);
    expect(isObjectiveProven(trainedOnce)).toBe(false);

    const proven: TargetProgress = {
      objectiveId: OBJ_A,
      conceptId: 'concept.x',
      attempts: 10,
      correct: 9,
      sessions: 2,
      lastCorrect: true,
      review: { repetitions: MASTERY_MIN_REPS, easiness: 2.5, intervalDays: 6, dueAt: T0 + 6 * DAY },
    };
    expect(isObjectiveTrained(proven)).toBe(true);
    expect(isObjectiveProven(proven)).toBe(true);
  });

  it('objectiveCoverage : complet seulement quand tous les objectifs exerçables sont prouvés', () => {
    const proven = (objId: string): TargetProgress => ({
      objectiveId: objId,
      conceptId: 'concept.x',
      attempts: 6,
      correct: 6,
      sessions: 2,
      lastCorrect: true,
      review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: T0 },
    });
    const exercisable = [OBJ_A, OBJ_B];
    expect(objectiveCoverage(exercisable, { [OBJ_A]: proven(OBJ_A) }).complete).toBe(false);
    const full = objectiveCoverage(exercisable, { [OBJ_A]: proven(OBJ_A), [OBJ_B]: proven(OBJ_B) });
    expect(full).toEqual({ proven: 2, trained: 2, total: 2, complete: true });
  });
});
