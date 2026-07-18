import { describe, it, expect } from '@jest/globals';
import { recordAnswer, completeSession, dayKey } from './progressLogic';
import type { ProgressState } from './repositories';
import { PROGRESS_SCHEMA_VERSION } from './repositories';

const T0 = 1_700_000_000_000; // timestamp fixe et reproductible
const DAY_MS = 24 * 60 * 60 * 1000;

function base(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    onboarded: true,
    level: 1,
    totalXp: 0,
    streakDays: 0,
    coins: 0,
    lastActiveDate: undefined,
    completedSkills: [],
    skills: {},
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    ...overrides,
  };
}

describe('progressLogic.recordAnswer', () => {
  it('attribue XP + pièces sur une bonne réponse', () => {
    const s = recordAnswer(base(), 'skill.a', 5, T0);
    expect(s.totalXp).toBe(10);
    expect(s.coins).toBe(5);
    expect(s.skills['skill.a'].xp).toBe(10);
    expect(s.level).toBe(1);
  });

  it('attribue peu d’XP et aucune pièce sur une mauvaise réponse', () => {
    const s = recordAnswer(base(), 'skill.a', 2, T0);
    expect(s.totalXp).toBe(2);
    expect(s.coins).toBe(0);
    expect(s.skills['skill.a'].xp).toBe(2);
  });

  it('garantit XP total = somme des XP par compétence (aucune divergence)', () => {
    let s = base();
    const grades: [string, 0 | 1 | 2 | 3 | 4 | 5][] = [
      ['skill.a', 5], ['skill.b', 2], ['skill.a', 4], ['skill.b', 5], ['skill.a', 1],
    ];
    let now = T0;
    for (const [id, g] of grades) {
      s = recordAnswer(s, id, g, now);
      now += 1000;
    }
    const sumSkillXp = Object.values(s.skills).reduce((acc, sk) => acc + sk.xp, 0);
    expect(s.totalXp).toBe(sumSkillXp);
  });

  it('recalcule le niveau à partir de l’XP total', () => {
    let s = base();
    let now = T0;
    for (let i = 0; i < 10; i++) {
      s = recordAnswer(s, `skill.${i}`, 5, now); // 10 XP chacun → 100 XP
      now += 1000;
    }
    expect(s.totalXp).toBe(100);
    expect(s.level).toBe(2);
  });

  it('enregistre un errorTag sur mauvaise réponse (pas sur bonne réponse)', () => {
    let s = recordAnswer(base(), 'skill.a', 2, T0, 'ex.1');
    expect(s.skills['skill.a'].errorTags).toEqual({ 'ex.1': 1 });
    // bonne réponse : aucun errorTag ajouté
    s = recordAnswer(s, 'skill.a', 5, T0 + 1000, 'ex.2');
    expect(s.skills['skill.a'].errorTags).toEqual({ 'ex.1': 1 });
    // nouvelle erreur sur le même tag → incrémente
    s = recordAnswer(s, 'skill.a', 1, T0 + 2000, 'ex.1');
    expect(s.skills['skill.a'].errorTags).toEqual({ 'ex.1': 2 });
  });
});

describe('progressLogic.completeSession', () => {
  it('ne débloque PAS la compétence si la session est échouée', () => {
    const { state, unlockedSkillId } = completeSession(base(), 'skill.a', false, T0);
    expect(unlockedSkillId).toBeNull();
    expect(state.completedSkills).toEqual([]);
  });

  it('débloque la compétence si la session est réussie', () => {
    const { state, unlockedSkillId } = completeSession(base(), 'skill.a', true, T0);
    expect(unlockedSkillId).toBe('skill.a');
    expect(state.completedSkills).toEqual(['skill.a']);
  });

  it('ne double jamais une compétence déjà terminée', () => {
    const start = base({ completedSkills: ['skill.a'] });
    const { state, unlockedSkillId } = completeSession(start, 'skill.a', true, T0);
    expect(unlockedSkillId).toBeNull();
    expect(state.completedSkills).toEqual(['skill.a']);
  });

  it('démarre la série à 1 le premier jour', () => {
    const { state } = completeSession(base(), 'skill.a', true, T0);
    expect(state.streakDays).toBe(1);
    expect(state.lastActiveDate).toBe(dayKey(T0));
  });

  it('incrémente la série un jour consécutif', () => {
    const start = base({ streakDays: 3, lastActiveDate: dayKey(T0 - DAY_MS) });
    const { state } = completeSession(start, 'skill.a', true, T0);
    expect(state.streakDays).toBe(4);
  });

  it('réinitialise la série après un trou', () => {
    const start = base({ streakDays: 9, lastActiveDate: dayKey(T0 - 3 * DAY_MS) });
    const { state } = completeSession(start, 'skill.a', true, T0);
    expect(state.streakDays).toBe(1);
  });

  it('est idempotent sur une même journée (pas de double comptage)', () => {
    const first = completeSession(base(), 'skill.a', true, T0).state;
    const second = completeSession(first, 'skill.a', true, T0);
    expect(second.state.streakDays).toBe(first.streakDays); // inchangé
    expect(second.state.completedSkills).toEqual(['skill.a']); // pas de doublon
    expect(second.unlockedSkillId).toBeNull();
  });
});
