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

  it('schéma v4 : registre du jour + quêtes/jalons par défaut', () => {
    // état v3 (sans daily/claimedQuestIds/claimedStreakMilestones) → défauts sûrs
    const m = migrateProgress({ schemaVersion: 3, totalXp: 40, streakDays: 2 }, T0)!;
    expect(m.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(m.daily).toEqual({ date: '', sessions: 0, correct: 0, xp: 0 });
    expect(m.claimedQuestIds).toEqual([]);
    expect(m.claimedStreakMilestones).toEqual([]);
  });

  it('schéma v5 : historique par défaut [] et assaini', () => {
    // état v4 sans historique → []
    const v4 = migrateProgress({ schemaVersion: 4, totalXp: 0 }, T0)!;
    expect(v4.history).toEqual([]);
    // historique assaini : instantanés datés valides seulement, nombres bornés
    const m = migrateProgress(
      {
        totalXp: 0,
        history: [
          { date: '2026-07-10', sessions: 1, correct: 3, xp: 20 },
          { date: '', sessions: 1, xp: 5 }, // date vide → écarté
          { sessions: 2 }, // sans date → écarté
          { date: '2026-07-11', sessions: -1, correct: 'x', xp: 12 }, // nombres assainis
        ],
      },
      T0,
    )!;
    expect(m.history).toEqual([
      { date: '2026-07-10', sessions: 1, correct: 3, xp: 20 },
      { date: '2026-07-11', sessions: 0, correct: 0, xp: 12 },
    ]);
  });

  it('schéma v6 : compteurs d’apprentissage par défaut et assainis', () => {
    // état v5 sans learning → défaut vide
    const v5 = migrateProgress({ schemaVersion: 5, totalXp: 0 }, T0)!;
    expect(v5.learning).toEqual({ conceptsExplored: [], worldsExplored: [], falseSignalsSpotted: 0, figuresRecognized: 0, bestRecognitionStreak: 0 });
    // learning assaini : chaînes dédupliquées, compteur borné
    const m = migrateProgress(
      {
        totalXp: 0,
        learning: {
          conceptsExplored: ['marteau', 'marteau', 'doji', 42],
          worldsExplored: ['world.candles', 'world.candles'],
          falseSignalsSpotted: -3,
        },
      },
      T0,
    )!;
    expect(m.learning).toEqual({
      conceptsExplored: ['marteau', 'doji'],
      worldsExplored: ['world.candles'],
      falseSignalsSpotted: 0,
      figuresRecognized: 0,
      bestRecognitionStreak: 0,
    });
  });

  it('schéma v7 : compteurs de reconnaissance par défaut et assainis', () => {
    // état v6 (avec learning mais sans les compteurs de reconnaissance) → défauts 0
    const v6 = migrateProgress({ schemaVersion: 6, totalXp: 0, learning: { conceptsExplored: ['marteau'], worldsExplored: [], falseSignalsSpotted: 1 } }, T0)!;
    expect(v6.learning!.figuresRecognized).toBe(0);
    expect(v6.learning!.bestRecognitionStreak).toBe(0);
    expect(v6.learning!.conceptsExplored).toEqual(['marteau']); // progression conservée
    // valeurs assainies (négatif / non fini → 0, décimal tronqué)
    const m = migrateProgress({ totalXp: 0, learning: { figuresRecognized: 12.9, bestRecognitionStreak: -4 } }, T0)!;
    expect(m.learning!.figuresRecognized).toBe(12);
    expect(m.learning!.bestRecognitionStreak).toBe(0);
  });

  it('schéma v4 : assainit un registre du jour corrompu et les listes', () => {
    const m = migrateProgress(
      {
        totalXp: 0,
        daily: { date: 5, sessions: -3, correct: 'x', xp: 12 },
        claimedQuestIds: ['quest.session', 7, null],
        claimedStreakMilestones: [3, 'x', 7],
      },
      T0,
    )!;
    expect(m.daily).toEqual({ date: '', sessions: 0, correct: 0, xp: 12 });
    expect(m.claimedQuestIds).toEqual(['quest.session']);
    expect(m.claimedStreakMilestones).toEqual([3, 7]);
  });

  it('schéma v8 : progression par cible + rotation par défaut {} et assainies', () => {
    // état v7 (sans targets ni rotation) → défauts {}
    const v7 = migrateProgress({ schemaVersion: 7, totalXp: 0 }, T0)!;
    expect(v7.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(v7.targets).toEqual({});
    expect(v7.rotation).toEqual({});

    // targets assainis : nombres bornés, review réparée, conceptId conservé
    const m = migrateProgress(
      {
        totalXp: 0,
        targets: {
          'concept.x::recognize': { objectiveId: 'concept.x::recognize', conceptId: 'concept.x', attempts: 4, correct: 3, sessions: 2, lastCorrect: true, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: T0 } },
          'concept.y::interpret': { attempts: -5, correct: 'x', review: null }, // assaini
        },
        rotation: { 'skill.a': 3, 'skill.b': -2, 'skill.c': 'x' }, // -2 et 'x' écartés
      },
      T0,
    )!;
    expect(m.targets!['concept.x::recognize'].correct).toBe(3);
    expect(m.targets!['concept.x::recognize'].review.repetitions).toBe(2);
    expect(m.targets!['concept.y::interpret'].attempts).toBe(0); // négatif → 0
    expect(m.targets!['concept.y::interpret'].objectiveId).toBe('concept.y::interpret'); // clé de repli
    expect(m.targets!['concept.y::interpret'].review.dueAt).toBe(T0); // review réparée
    expect(m.rotation).toEqual({ 'skill.a': 3 });
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
