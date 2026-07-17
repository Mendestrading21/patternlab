import { describe, it, expect } from '@jest/globals';
import { selectCurrentSkill, selectDueReviews, buildDailyMission } from './dailyMission';
import type { ProgressState } from './repositories';
import { PROGRESS_SCHEMA_VERSION } from './repositories';
import type { Skill } from '../engines/learning';

const T0 = 1_700_000_000_000;
const DAY_MS = 24 * 60 * 60 * 1000;

const SKILLS: Skill[] = [
  { id: 'a', name: 'A' },
  { id: 'b', name: 'B' },
  { id: 'c', name: 'C' },
];

function review(dueAt: number) {
  return { repetitions: 1, easiness: 2.5, intervalDays: 1, dueAt };
}

function base(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    onboarded: true,
    level: 1,
    totalXp: 0,
    streakDays: 0,
    coins: 0,
    completedSkills: [],
    skills: {},
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    ...overrides,
  };
}

describe('selectCurrentSkill', () => {
  it('renvoie la première compétence non terminée', () => {
    expect(selectCurrentSkill(base(), SKILLS)?.id).toBe('a');
    expect(selectCurrentSkill(base({ completedSkills: ['a'] }), SKILLS)?.id).toBe('b');
  });
  it('renvoie null si tout est terminé', () => {
    expect(selectCurrentSkill(base({ completedSkills: ['a', 'b', 'c'] }), SKILLS)).toBeNull();
  });
});

describe('selectDueReviews', () => {
  it('ne retient que les compétences terminées ET dues', () => {
    const state = base({
      completedSkills: ['a', 'b'],
      skills: {
        a: { skillId: 'a', xp: 10, mastery: 0.5, confidence: 0.4, review: review(T0 - DAY_MS) }, // due
        b: { skillId: 'b', xp: 10, mastery: 0.5, confidence: 0.4, review: review(T0 + DAY_MS) }, // pas due
      },
    });
    const due = selectDueReviews(state, SKILLS, T0);
    expect(due.map((s) => s.id)).toEqual(['a']);
  });

  it('ignore une compétence due mais non terminée', () => {
    const state = base({
      completedSkills: [],
      skills: { a: { skillId: 'a', xp: 0, mastery: 0, confidence: 0, review: review(T0 - DAY_MS) } },
    });
    expect(selectDueReviews(state, SKILLS, T0)).toEqual([]);
  });
});

describe('buildDailyMission (une seule action principale)', () => {
  it('priorise la révision due sur l’apprentissage', () => {
    const state = base({
      completedSkills: ['a'],
      skills: { a: { skillId: 'a', xp: 10, mastery: 0.6, confidence: 0.5, review: review(T0 - DAY_MS) } },
    });
    const m = buildDailyMission(state, SKILLS, T0);
    expect(m.kind).toBe('review');
    expect(m.skillId).toBe('a');
  });

  it('propose d’apprendre la compétence courante si rien n’est dû', () => {
    const state = base({ completedSkills: ['a'] });
    const m = buildDailyMission(state, SKILLS, T0);
    expect(m.kind).toBe('learn');
    expect(m.skillId).toBe('b');
  });

  it('bascule sur « terminé » quand tout est complété et rien n’est dû', () => {
    const state = base({
      completedSkills: ['a', 'b', 'c'],
      skills: {
        a: { skillId: 'a', xp: 10, mastery: 1, confidence: 1, review: review(T0 + DAY_MS) },
        b: { skillId: 'b', xp: 10, mastery: 1, confidence: 1, review: review(T0 + DAY_MS) },
        c: { skillId: 'c', xp: 10, mastery: 1, confidence: 1, review: review(T0 + DAY_MS) },
      },
    });
    const m = buildDailyMission(state, SKILLS, T0);
    expect(m.kind).toBe('done');
    expect(m.skillId).toBeNull();
  });
});
