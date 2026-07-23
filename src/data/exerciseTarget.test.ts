import { describe, it, expect } from '@jest/globals';
import { allExercisesFlat } from './repoTruth';
import { V5_CONCEPTS } from './learningContent';
import { objectiveByIdIn, parseObjectiveId } from './learningTarget';

/**
 * Vérifie que la cible portée par un exercice (conceptId + objectiveId) se résout
 * réellement dans le modèle canonique : concept existant + objectif dérivable.
 * Empêche une cible orpheline (concept/objectif fantôme).
 */
describe('cibles d’exercices → modèle canonique', () => {
  const targeted = allExercisesFlat().filter((e) => e.target);

  it('au moins un exercice porte une cible pédagogique', () => {
    expect(targeted.length).toBeGreaterThan(0);
  });

  for (const ex of targeted) {
    it(`${ex.id} cible un concept et un objectif réels`, () => {
      const t = ex.target!;
      const parsed = parseObjectiveId(t.objectiveId);
      expect(parsed).not.toBeNull();
      expect(parsed!.conceptId).toBe(t.conceptId);
      expect(V5_CONCEPTS.some((c) => c.id === t.conceptId)).toBe(true);
      expect(objectiveByIdIn(V5_CONCEPTS, t.objectiveId)).toBeDefined();
    });
  }
});
