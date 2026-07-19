import { describe, it, expect } from '@jest/globals';
import { computeStats } from './stats';
import { dayKey } from './gamification';
import { defaultProgress } from './seed';
import type { ProgressState } from './repositories';
import { initialProgress, type Skill, type SkillProgress } from '../engines/learning';

const T0 = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

const SKILLS: Skill[] = [
  { id: 'a', name: 'Alpha', description: '' },
  { id: 'b', name: 'Bravo', description: '' },
];

function sp(overrides: Partial<SkillProgress>): SkillProgress {
  return { ...initialProgress('a', T0), ...overrides };
}

function fresh(overrides: Partial<ProgressState> = {}): ProgressState {
  return { ...defaultProgress(T0), ...overrides };
}

describe('computeStats — exploration (compréhension V5)', () => {
  it('reporte les compteurs d’exploration', () => {
    const s = fresh({ learning: { conceptsExplored: ['a', 'b', 'c'], worldsExplored: ['world.candles', 'world.structure'], falseSignalsSpotted: 4 } });
    const stats = computeStats(s, SKILLS, T0);
    expect(stats.exploration).toEqual({ conceptsExplored: 3, worldsExplored: 2, falseSignalsSpotted: 4 });
  });
  it('défaut à zéro si learning absent', () => {
    const stats = computeStats(fresh({ learning: undefined }), SKILLS, T0);
    expect(stats.exploration).toEqual({ conceptsExplored: 0, worldsExplored: 0, falseSignalsSpotted: 0 });
  });
});

describe('computeStats — vue d’ensemble & maîtrise', () => {
  it('reporte l’état global et compte les compétences', () => {
    const s = fresh({ totalXp: 250, level: 3, coins: 40, streakDays: 5, completedSkills: ['a'] });
    const stats = computeStats(s, SKILLS, T0);
    expect(stats.level).toBe(3);
    expect(stats.totalXp).toBe(250);
    expect(stats.xpInLevel).toBe(50);
    expect(stats.completedCount).toBe(1);
    expect(stats.totalSkills).toBe(2);
  });

  it('classe chaque compétence par statut de maîtrise (new si jamais commencée)', () => {
    const s = fresh({
      skills: {
        a: sp({ skillId: 'a', xp: 40, mastery: 0.85, review: { repetitions: 3, easiness: 2.5, intervalDays: 15, dueAt: T0 } }),
      },
    });
    const stats = computeStats(s, SKILLS, T0);
    const a = stats.skills.find((x) => x.id === 'a')!;
    const b = stats.skills.find((x) => x.id === 'b')!;
    expect(a.status).toBe('mastered');
    expect(a.started).toBe(true);
    expect(b.status).toBe('new');
    expect(b.started).toBe(false);
    expect(stats.masteryDistribution.mastered).toBe(1);
    expect(stats.masteryDistribution.new).toBe(1);
  });
});

describe('computeStats — erreurs récurrentes', () => {
  it('agrège et classe les errorTags, avec le nom de la compétence', () => {
    const s = fresh({
      skills: {
        a: sp({ skillId: 'a', errorTags: { ex1: 1, ex2: 3 } }),
        b: sp({ skillId: 'b', errorTags: { ex3: 2 } }),
      },
    });
    const stats = computeStats(s, SKILLS, T0);
    expect(stats.recurringErrors[0]).toEqual({ tag: 'ex2', count: 3, skillId: 'a', skillName: 'Alpha' });
    expect(stats.recurringErrors.map((e) => e.count)).toEqual([3, 2, 1]);
    expect(stats.recurringErrors.find((e) => e.skillId === 'b')?.skillName).toBe('Bravo');
  });

  it('aucune erreur → liste vide', () => {
    expect(computeStats(fresh(), SKILLS, T0).recurringErrors).toEqual([]);
  });
});

describe('computeStats — série d’activité', () => {
  it('produit une fenêtre de 7 jours chronologique terminée aujourd’hui', () => {
    const stats = computeStats(fresh(), SKILLS, T0);
    expect(stats.activity).toHaveLength(7);
    expect(stats.activity[6].date).toBe(dayKey(T0));
    expect(stats.activity[6].isToday).toBe(true);
    expect(stats.activity[0].date).toBe(dayKey(T0 - 6 * DAY));
  });

  it('combine l’historique et le registre du jour', () => {
    const s = fresh({
      history: [
        { date: dayKey(T0 - 2 * DAY), sessions: 1, correct: 3, xp: 20 },
        { date: dayKey(T0 - 5 * DAY), sessions: 2, correct: 5, xp: 35 },
      ],
      daily: { date: dayKey(T0), sessions: 1, correct: 2, xp: 15 },
    });
    const stats = computeStats(s, SKILLS, T0);
    const today = stats.activity.find((a) => a.isToday)!;
    expect(today.xp).toBe(15);
    expect(stats.activity.find((a) => a.date === dayKey(T0 - 2 * DAY))?.xp).toBe(20);
    expect(stats.windowXp).toBe(20 + 35 + 15);
    expect(stats.activeDays).toBe(3);
    expect(stats.peakXp).toBe(35);
  });

  it('un jour hors fenêtre n’est pas compté', () => {
    const s = fresh({ history: [{ date: dayKey(T0 - 10 * DAY), sessions: 1, correct: 1, xp: 99 }] });
    const stats = computeStats(s, SKILLS, T0);
    expect(stats.windowXp).toBe(0);
    expect(stats.activeDays).toBe(0);
  });
});
