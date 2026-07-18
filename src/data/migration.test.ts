import { describe, it, expect } from '@jest/globals';
import { migrateProgress, PROGRESS_SCHEMA_VERSION } from './repositories';

const T0 = 1_700_000_000_000;

describe('migrateProgress', () => {
  it('rejette une valeur non-objet', () => {
    expect(migrateProgress(null, T0)).toBeNull();
    expect(migrateProgress('nope', T0)).toBeNull();
    expect(migrateProgress(42, T0)).toBeNull();
  });

  it('rejette un schéma FUTUR inconnu (pas de rétro-migration hasardeuse)', () => {
    expect(migrateProgress({ schemaVersion: PROGRESS_SCHEMA_VERSION + 5, totalXp: 10 }, T0)).toBeNull();
  });

  it('migre un ancien état partiel sans perdre la progression', () => {
    // Ancien schéma : ni schemaVersion, ni completedSkills, ni coins, ni lastActiveDate.
    const legacy = {
      onboarded: true,
      totalXp: 250,
      streakDays: 4,
      skills: {
        'skill.a': { skillId: 'skill.a', xp: 120, mastery: 0.6, confidence: 0.5, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: T0 } },
      },
    };
    const m = migrateProgress(legacy, T0)!;
    expect(m).not.toBeNull();
    expect(m.totalXp).toBe(250);
    expect(m.streakDays).toBe(4);
    expect(m.coins).toBe(0);
    expect(m.completedSkills).toEqual([]);
    expect(m.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(m.skills['skill.a'].xp).toBe(120);
  });

  it('recalcule toujours le niveau depuis l’XP total (cohérence)', () => {
    const m = migrateProgress({ totalXp: 350, level: 1 /* faux niveau persisté */ }, T0)!;
    expect(m.level).toBe(4); // floor(350/100)+1
  });

  it('répare une compétence dont la révision est absente/corrompue', () => {
    const m = migrateProgress({ totalXp: 0, skills: { 'skill.a': { xp: 5 } } }, T0)!;
    const review = m.skills['skill.a'].review;
    expect(review.dueAt).toBe(T0);
    expect(review.easiness).toBe(2.5);
    expect(m.skills['skill.a'].xp).toBe(5);
  });

  it('nettoie les champs invalides (XP négatif, compétences non-string)', () => {
    const m = migrateProgress({ totalXp: -99, completedSkills: ['skill.a', 3, null, 'skill.b'] }, T0)!;
    expect(m.totalXp).toBe(0);
    expect(m.completedSkills).toEqual(['skill.a', 'skill.b']);
  });

  it('schéma v3 : errorTags par défaut {} et assainis', () => {
    // ancien état v2 sans errorTags → {}
    const legacy = migrateProgress(
      { schemaVersion: 2, totalXp: 0, skills: { 'skill.a': { xp: 5, review: { dueAt: T0, easiness: 2.5 } } } },
      T0,
    )!;
    expect(legacy.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(legacy.skills['skill.a'].errorTags).toEqual({});

    // errorTags v3 : ne garde que les entiers positifs
    const m = migrateProgress(
      { totalXp: 0, skills: { 'skill.a': { xp: 0, review: { dueAt: T0, easiness: 2.5 }, errorTags: { ex1: 2, ex2: 0, ex3: -1, ex4: 'x' } } } },
      T0,
    )!;
    expect(m.skills['skill.a'].errorTags).toEqual({ ex1: 2 });
  });
});
