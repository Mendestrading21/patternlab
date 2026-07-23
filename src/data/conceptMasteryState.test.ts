import { describe, it, expect } from '@jest/globals';
import { conceptState, masteryGate, canBeMastered, isRepresentativeConcept } from './conceptMasteryState';
import { V5_CONCEPTS } from './learningContent';
import { CHECKPOINT_ID, exercisableObjectiveIds } from './seed';
import type { TargetProgress } from './targetProgress';

const anatomy = V5_CONCEPTS.find((c) => c.slug === 'anatomie-bougie')!; // représentatif de skill.candles
const marteau = V5_CONCEPTS.find((c) => c.slug === 'marteau')!; // partage skill.candles, non représentatif

/** Cible prouvée (entraînée + retenue) pour un objectif donné. */
const proven = (objectiveId: string, conceptId: string): TargetProgress => ({
  objectiveId,
  conceptId,
  attempts: 6,
  correct: 6,
  sessions: 2,
  lastCorrect: true,
  review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: 0 },
});

/** Toutes les cibles exerçables d'un concept, prouvées. */
const fullCoverage = (conceptId: string): Record<string, TargetProgress> => {
  const out: Record<string, TargetProgress> = {};
  for (const objId of exercisableObjectiveIds(conceptId)) out[objId] = proven(objId, conceptId);
  return out;
};

describe('isRepresentativeConcept', () => {
  it('vrai pour le concept entraîné de la compétence', () => {
    expect(isRepresentativeConcept(anatomy)).toBe(true);
  });
  it('faux pour un concept qui partage seulement le skillId', () => {
    expect(isRepresentativeConcept(marteau)).toBe(false);
  });
  it('faux sans skillId', () => {
    expect(isRepresentativeConcept({ skillId: undefined, slug: 'x' })).toBe(false);
  });
});

describe('couverture des objectifs exerçables', () => {
  it('anatomie-bougie expose plusieurs objectifs exerçables', () => {
    expect(exercisableObjectiveIds('concept.candle-anatomy').length).toBeGreaterThanOrEqual(2);
  });
});

describe('masteryGate — couverture des objectifs réellement entraînés', () => {
  it('toutes les conditions réunies quand la couverture est complète + checkpoint', () => {
    const g = masteryGate(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      targets: fullCoverage('concept.candle-anatomy'),
      completedSkills: [CHECKPOINT_ID],
    });
    expect(g.representative).toBe(true);
    expect(g.explored).toBe(true);
    expect(g.coverageComplete).toBe(true);
    expect(g.checkpointPassed).toBe(true);
  });

  it('une couverture incomplète (un objectif manquant) casse la maîtrise', () => {
    const cov = fullCoverage('concept.candle-anatomy');
    const oneMissing = { ...cov };
    delete oneMissing[Object.keys(oneMissing)[0]]; // retire un objectif prouvé
    const g = masteryGate(anatomy, { exploredSlugs: ['anatomie-bougie'], targets: oneMissing, completedSkills: [CHECKPOINT_ID] });
    expect(g.coverageComplete).toBe(false);
  });
});

describe('canBeMastered / conceptState', () => {
  const fullInput = {
    exploredSlugs: ['anatomie-bougie'],
    targets: fullCoverage('concept.candle-anatomy'),
    completedSkills: [CHECKPOINT_ID],
  };

  it('canBeMastered vrai seulement quand couverture complète + checkpoint + exploré + représentatif', () => {
    expect(canBeMastered(anatomy, fullInput)).toBe(true);
    expect(canBeMastered(anatomy, { ...fullInput, completedSkills: [] })).toBe(false);
    expect(canBeMastered(anatomy, { ...fullInput, exploredSlugs: [] })).toBe(false);
    expect(canBeMastered(marteau, fullInput)).toBe(false); // non représentatif
  });

  it('conceptState traverse new → explored → completed → strong → mastered', () => {
    const objs = exercisableObjectiveIds('concept.candle-anatomy');
    expect(conceptState(anatomy, { exploredSlugs: [] })).toBe('new');
    expect(conceptState(anatomy, { exploredSlugs: ['anatomie-bougie'] })).toBe('explored');
    // « completed » : un objectif entraîné (correct>0) mais non prouvé (reps 0).
    const trained: Record<string, TargetProgress> = {
      [objs[0]]: { objectiveId: objs[0], conceptId: 'concept.candle-anatomy', attempts: 3, correct: 2, sessions: 1, lastCorrect: true, review: { repetitions: 0, easiness: 2.5, intervalDays: 0, dueAt: 0 } },
    };
    expect(conceptState(anatomy, { exploredSlugs: ['anatomie-bougie'], targets: trained })).toBe('completed');
    // « strong » : un objectif prouvé mais couverture incomplète / checkpoint absent.
    const oneProven: Record<string, TargetProgress> = { [objs[0]]: proven(objs[0], 'concept.candle-anatomy') };
    expect(conceptState(anatomy, { exploredSlugs: ['anatomie-bougie'], targets: oneProven, completedSkills: [CHECKPOINT_ID] })).toBe('strong');
    // « mastered » : couverture complète + checkpoint.
    expect(conceptState(anatomy, fullInput)).toBe('mastered');
  });

  it('deux concepts d’une même compétence ne partagent pas la maîtrise', () => {
    expect(conceptState(anatomy, fullInput)).toBe('mastered');
    // marteau (non représentatif) reste « exploré » même avec la couverture du concept représentatif.
    expect(conceptState(marteau, { ...fullInput, exploredSlugs: ['marteau'] })).toBe('explored');
  });
});
