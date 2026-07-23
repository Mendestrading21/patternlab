import { describe, it, expect } from '@jest/globals';
import { conceptState, masteryGate, canBeMastered, isRepresentativeConcept } from './conceptMasteryState';
import { V5_CONCEPTS } from './learningContent';
import { CHECKPOINT_ID } from './seed';
import { initialReview, type SkillProgress } from '../engines/learning';

const anatomy = V5_CONCEPTS.find((c) => c.slug === 'anatomie-bougie')!; // représentatif de skill.candles
const marteau = V5_CONCEPTS.find((c) => c.slug === 'marteau')!; // partage skill.candles, non représentatif

const sp = (over: Partial<SkillProgress>): SkillProgress => ({
  skillId: 'skill.candles',
  xp: 0,
  mastery: 0,
  confidence: 0,
  review: initialReview(0),
  errorTags: {},
  ...over,
});

const mastered = sp({ mastery: 0.9, confidence: 0.9, review: { repetitions: 3, easiness: 2.5, intervalDays: 15, dueAt: 0 } });

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

describe('masteryGate — faisceau de preuves', () => {
  it('toutes les conditions réunies pour une compétence pleinement maîtrisée', () => {
    const g = masteryGate(anatomy, {
      exploredSlugs: ['anatomie-bougie'],
      skills: { 'skill.candles': mastered },
      completedSkills: [CHECKPOINT_ID, 'skill.candles'],
    });
    expect(g).toEqual({
      representative: true,
      trained: true,
      multipleSessions: true,
      deferredRetention: true,
      checkpointPassed: true,
      noRecentFailure: true,
    });
  });

  it('un échec récent (répétitions remises à 0) casse plusieurs conditions', () => {
    const failed = sp({ mastery: 0.85, review: { repetitions: 0, easiness: 2.5, intervalDays: 0, dueAt: 0 } });
    const g = masteryGate(anatomy, { exploredSlugs: [], skills: { 'skill.candles': failed }, completedSkills: [CHECKPOINT_ID] });
    expect(g.multipleSessions).toBe(false);
    expect(g.deferredRetention).toBe(false);
    expect(g.noRecentFailure).toBe(false);
  });

  it('sans checkpoint, la condition checkpoint est fausse', () => {
    const g = masteryGate(anatomy, { exploredSlugs: [], skills: { 'skill.candles': mastered }, completedSkills: [] });
    expect(g.checkpointPassed).toBe(false);
  });
});

describe('canBeMastered / conceptState', () => {
  const fullInput = {
    exploredSlugs: ['anatomie-bougie'],
    skills: { 'skill.candles': mastered },
    completedSkills: [CHECKPOINT_ID],
  };

  it('canBeMastered vrai seulement quand tout est réuni', () => {
    expect(canBeMastered(anatomy, fullInput)).toBe(true);
    expect(canBeMastered(anatomy, { ...fullInput, completedSkills: [] })).toBe(false);
    expect(canBeMastered(anatomy, { ...fullInput, exploredSlugs: [] })).toBe(false);
    expect(canBeMastered(marteau, fullInput)).toBe(false); // non représentatif
  });

  it('conceptState traverse new → explored → completed → strong → mastered', () => {
    expect(conceptState(anatomy, { exploredSlugs: [], skills: {} })).toBe('new');
    expect(conceptState(anatomy, { exploredSlugs: ['anatomie-bougie'], skills: {} })).toBe('explored');
    expect(
      conceptState(anatomy, {
        exploredSlugs: ['anatomie-bougie'],
        skills: { 'skill.candles': sp({ mastery: 0.3, review: { repetitions: 1, easiness: 2.5, intervalDays: 1, dueAt: 0 } }) },
        completedSkills: ['skill.candles'],
      }),
    ).toBe('completed');
    expect(
      conceptState(anatomy, {
        exploredSlugs: ['anatomie-bougie'],
        skills: { 'skill.candles': sp({ mastery: 0.85, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: 0 } }) },
        completedSkills: [CHECKPOINT_ID],
      }),
    ).toBe('strong');
    expect(conceptState(anatomy, fullInput)).toBe('mastered');
  });

  it('deux concepts d’une même compétence ne partagent pas la maîtrise', () => {
    expect(conceptState(anatomy, fullInput)).toBe('mastered');
    expect(conceptState(marteau, { ...fullInput, exploredSlugs: ['marteau'] })).toBe('explored');
  });
});
