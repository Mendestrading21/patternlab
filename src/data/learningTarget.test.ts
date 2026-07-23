import { describe, it, expect } from '@jest/globals';
import { V5_CONCEPTS } from './learningContent';
import {
  OBJECTIVE_KINDS,
  objectiveId,
  parseObjectiveId,
  targetKey,
  objectivesForConcept,
  allLearningObjectives,
  objectivesById,
  objectiveByIdIn,
} from './learningTarget';
import type { LearningConcept } from './learningConcept';

const conceptOf = (over: Partial<LearningConcept>): LearningConcept =>
  ({
    id: 'concept.test',
    slug: 'test',
    title: 'Test',
    shortTitle: 'Test',
    aliases: [],
    categoryId: 'cat.x',
    worldId: 'world.x',
    difficulty: 1,
    prerequisites: [],
    tags: [],
    learningObjective: 'Reconnaître la notion de test.',
    definitionShort: '',
    definitionDetailed: '',
    howToRecognize: [],
    contextRequired: [],
    interpretationLimits: [],
    falseSignals: [],
    commonMistakes: [],
    checklist: [],
    chartExamples: [],
    interactiveTemplates: [],
    flashcards: [],
    miniQuizzes: [],
    relatedConceptIds: [],
    sources: [],
    version: 1,
    status: 'needsReview',
    locale: 'fr',
    disclaimer: '',
    ...over,
  }) as LearningConcept;

describe('learningTarget — cible canonique (conceptId + objectiveId)', () => {
  it('objectiveId / parseObjectiveId sont réversibles', () => {
    const id = objectiveId('concept.marteau', 'invalidate');
    expect(id).toBe('concept.marteau::invalidate');
    expect(parseObjectiveId(id)).toEqual({ conceptId: 'concept.marteau', kind: 'invalidate' });
  });

  it('parseObjectiveId rejette un id malformé ou un kind inconnu', () => {
    expect(parseObjectiveId('sans-separateur')).toBeNull();
    expect(parseObjectiveId('concept.x::inconnu')).toBeNull();
    expect(parseObjectiveId('::recognize')).toBeNull();
  });

  it('gère les conceptId contenant « :: » (utilise le dernier séparateur)', () => {
    const id = objectiveId('ns::concept.x', 'recognize');
    expect(parseObjectiveId(id)).toEqual({ conceptId: 'ns::concept.x', kind: 'recognize' });
  });

  it('recognize est toujours présent (chaque concept a un learningObjective)', () => {
    const objs = objectivesForConcept(conceptOf({}));
    expect(objs.map((o) => o.kind)).toContain('recognize');
    expect(objs[0].kind).toBe('recognize'); // ordre canonique
    expect(objs[0].label).toBe('Reconnaître la notion de test.');
  });

  it('les objectifs secondaires n’apparaissent que si le contenu existe', () => {
    const minimal = objectivesForConcept(conceptOf({}));
    expect(minimal.map((o) => o.kind)).toEqual(['recognize']);

    const rich = objectivesForConcept(
      conceptOf({
        definitionShort: 'Une bougie de rejet.',
        confirmationZone: 'clôture au-dessus du plus haut',
        invalidation: 'cassure sous le plancher',
        falseSignals: ['marteau isolé sans contexte'],
      }),
    );
    expect(rich.map((o) => o.kind)).toEqual(['recognize', 'interpret', 'confirm', 'invalidate', 'avoid-false-signal']);
  });

  it('les libellés dérivent du contenu réel du concept (jamais inventés)', () => {
    const objs = objectivesForConcept(
      conceptOf({ invalidation: 'cassure sous le plancher', falseSignals: ['mèche isolée'] }),
    );
    const inval = objs.find((o) => o.kind === 'invalidate');
    const faux = objs.find((o) => o.kind === 'avoid-false-signal');
    expect(inval?.label).toContain('cassure sous le plancher');
    expect(faux?.label).toContain('mèche isolée');
  });

  it('targetKey distingue deux cibles du même concept', () => {
    const a = targetKey({ conceptId: 'c', objectiveId: 'c::recognize' });
    const b = targetKey({ conceptId: 'c', objectiveId: 'c::invalidate' });
    expect(a).not.toBe(b);
  });

  describe('sur le corpus réel V5_CONCEPTS', () => {
    it('chaque concept expose au moins un objectif', () => {
      for (const c of V5_CONCEPTS) {
        expect(objectivesForConcept(c).length).toBeGreaterThanOrEqual(1);
      }
    });

    it('tous les objectiveId sont uniques et bien formés', () => {
      const all = allLearningObjectives(V5_CONCEPTS);
      const ids = all.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length); // aucun doublon
      for (const o of all) {
        expect(parseObjectiveId(o.id)).toEqual({ conceptId: o.conceptId, kind: o.kind });
        expect(OBJECTIVE_KINDS).toContain(o.kind);
        expect(o.label.trim().length).toBeGreaterThan(0);
      }
    });

    it('objectivesById et objectiveByIdIn sont cohérents', () => {
      const index = objectivesById(V5_CONCEPTS);
      const first = allLearningObjectives(V5_CONCEPTS)[0];
      expect(index.get(first.id)).toEqual(first);
      expect(objectiveByIdIn(V5_CONCEPTS, first.id)).toEqual(first);
      expect(objectiveByIdIn(V5_CONCEPTS, 'concept.inexistant::recognize')).toBeUndefined();
    });
  });
});
