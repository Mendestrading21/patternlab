import { describe, it, expect } from '@jest/globals';
import { conceptMasteryStatus } from './conceptMastery';
import { V5_CONCEPTS } from './learningContent';
import { CHECKPOINT_ID, exercisableObjectiveIds } from './seed';
import type { TargetProgress } from './targetProgress';

const anatomy = V5_CONCEPTS.find((c) => c.slug === 'anatomie-bougie')!; // skill.candles, REPRÉSENTATIF
const marteau = V5_CONCEPTS.find((c) => c.slug === 'marteau')!; // skill.candles, NON représentatif
const noSkill = V5_CONCEPTS.find((c) => !c.skillId)!;

const proven = (objectiveId: string, conceptId: string): TargetProgress => ({
  objectiveId,
  conceptId,
  attempts: 6,
  correct: 6,
  sessions: 2,
  lastCorrect: true,
  review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: 0 },
});

const fullCoverage = (conceptId: string): Record<string, TargetProgress> => {
  const out: Record<string, TargetProgress> = {};
  for (const objId of exercisableObjectiveIds(conceptId)) out[objId] = proven(objId, conceptId);
  return out;
};

describe('conceptMasteryStatus — découverte ≠ maîtrise (couverture par cible)', () => {
  it('Nouveau quand ni exploré ni entraîné', () => {
    const s = conceptMasteryStatus(anatomy, { exploredSlugs: [], skills: {} });
    expect(s.state).toBe('new');
    expect(s.label).toBe('Nouveau');
  });

  it('Découvert quand la fiche est consultée mais aucun objectif entraîné', () => {
    const s = conceptMasteryStatus(anatomy, { exploredSlugs: ['anatomie-bougie'], skills: {} });
    expect(s.state).toBe('explored');
    expect(s.explored).toBe(true);
    expect(s.mastered).toBe(false);
  });

  it('« solide » (un objectif prouvé, couverture incomplète) n’est JAMAIS « maîtrisé »', () => {
    const objs = exercisableObjectiveIds('concept.candle-anatomy');
    const oneProven: Record<string, TargetProgress> = { [objs[0]]: proven(objs[0], 'concept.candle-anatomy') };
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: {},
      completedSkills: [CHECKPOINT_ID],
      targets: oneProven,
    });
    expect(s.state).toBe('strong');
    expect(s.stateLabel).toBe('Solide');
    expect(s.mastered).toBe(false);
  });

  it('maîtrisé seulement avec couverture COMPLÈTE des objectifs + checkpoint + exploré', () => {
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: {},
      completedSkills: [CHECKPOINT_ID],
      targets: fullCoverage('concept.candle-anatomy'),
    });
    expect(s.state).toBe('mastered');
    expect(s.mastered).toBe(true);
  });

  it('sans checkpoint indépendant, pas de maîtrise même avec couverture complète', () => {
    const s = conceptMasteryStatus(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: {},
      completedSkills: [],
      targets: fullCoverage('concept.candle-anatomy'),
    });
    expect(s.mastered).toBe(false);
    expect(s.state).toBe('strong');
  });

  it('deux concepts partageant skillId ne partagent pas la maîtrise (anti-partage)', () => {
    // « marteau » partage skill.candles mais n’est pas le concept entraîné.
    const s = conceptMasteryStatus(marteau, {
      exploredSlugs: ['marteau'],
      skills: {},
      completedSkills: [CHECKPOINT_ID],
      targets: fullCoverage('concept.candle-anatomy'),
    });
    expect(s.mastered).toBe(false);
    expect(s.state).toBe('explored');
  });

  it('un concept sans compétence liée reste Nouveau/Découvert', () => {
    expect(conceptMasteryStatus(noSkill, { exploredSlugs: [], skills: {} }).state).toBe('new');
    expect(conceptMasteryStatus(noSkill, { exploredSlugs: [noSkill.slug], skills: {} }).state).toBe('explored');
  });
});
