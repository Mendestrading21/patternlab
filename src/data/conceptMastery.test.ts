import { describe, it, expect } from '@jest/globals';
import { conceptMasteryStatus } from './conceptMastery';
import { V5_CONCEPTS } from './learningContent';
import { initialReview, type SkillProgress } from '../engines/learning';

const anatomy = V5_CONCEPTS.find((c) => c.slug === 'anatomie-bougie')!; // skillId: skill.candles
const noSkill = V5_CONCEPTS.find((c) => !c.skillId)!;

const sp = (over: Partial<SkillProgress>): SkillProgress => ({
  skillId: 'skill.candles',
  xp: 0,
  mastery: 0,
  confidence: 0,
  review: initialReview(0),
  errorTags: {},
  ...over,
});

describe('conceptMasteryStatus — découverte ≠ maîtrise', () => {
  it('Nouveau quand ni exploré ni maîtrisé', () => {
    expect(conceptMasteryStatus(anatomy, { exploredSlugs: [], skills: {} }).label).toBe('Nouveau');
  });

  it('Découvert quand la fiche est consultée mais la compétence pas solide', () => {
    const s = conceptMasteryStatus(anatomy, { exploredSlugs: ['anatomie-bougie'], skills: {} });
    expect(s.label).toBe('Découvert');
    expect(s.explored).toBe(true);
    expect(s.mastered).toBe(false);
  });

  it('Maîtrisé quand la compétence liée est solide/maîtrisée (même sans exploration)', () => {
    const strong = sp({ mastery: 0.85, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: 0 } });
    const s = conceptMasteryStatus(anatomy, { exploredSlugs: [], skills: { 'skill.candles': strong } });
    expect(s.label).toBe('Maîtrisé');
    expect(s.mastered).toBe(true);
  });

  it('un concept sans compétence liée reste Nouveau/Découvert', () => {
    expect(conceptMasteryStatus(noSkill, { exploredSlugs: [], skills: {} }).label).toBe('Nouveau');
    expect(conceptMasteryStatus(noSkill, { exploredSlugs: [noSkill.slug], skills: {} }).label).toBe('Découvert');
  });
});
