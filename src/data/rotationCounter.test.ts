import { describe, it, expect } from '@jest/globals';
import { completeSession, rotationOf } from './progressLogic';
import { getExercises, exerciseVariantsForObjective, pickVariant } from './seed';
import { rotateExercises } from './exerciseRotation';
import type { ProgressState } from './repositories';
import { PROGRESS_SCHEMA_VERSION } from './repositories';

const T0 = 1_700_000_000_000;

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
    daily: { date: '', sessions: 0, correct: 0, xp: 0 },
    claimedQuestIds: [],
    claimedStreakMilestones: [],
    history: [],
    targets: {},
    rotation: {},
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    ...overrides,
  };
}

describe('compteur de rotation — robuste à l’échec', () => {
  it('avance à chaque session terminée, RÉUSSIE ou non', () => {
    const afterFail = completeSession(base(), 'skill.actions', false, T0).state;
    expect(rotationOf(afterFail, 'skill.actions')).toBe(1); // échec → avance quand même

    const afterPass = completeSession(afterFail, 'skill.actions', true, T0).state;
    expect(rotationOf(afterPass, 'skill.actions')).toBe(2);
  });

  it('une session échouée présente une SÉRIE différente à la tentative suivante (variantes)', () => {
    const all = getExercises('skill.actions');
    const firstTry = rotateExercises(all, 3, rotationOf(base(), 'skill.actions')); // round 0

    // Session échouée → rotation avance à 1.
    const afterFail = completeSession(base(), 'skill.actions', false, T0).state;
    const secondTry = rotateExercises(all, 3, rotationOf(afterFail, 'skill.actions')); // round 1

    expect(secondTry).not.toEqual(firstTry); // pas la même série malgré l'échec
  });

  it('le compteur de rotation est indépendant des répétitions SM-2 (qu’un échec remet à zéro)', () => {
    // Deux échecs de suite : les répétitions SM-2 resteraient à 0, mais la rotation avance.
    let s = base();
    s = completeSession(s, 'skill.trend', false, T0).state;
    s = completeSession(s, 'skill.trend', false, T0).state;
    expect(rotationOf(s, 'skill.trend')).toBe(2);
  });
});

describe('pickVariant — variante différente pour une cible', () => {
  it('un objectif à plusieurs variantes tourne selon le round', () => {
    // concept.market-basics::interpret possède plusieurs exercices (mcq, tf, numeric, match, …).
    const objId = 'concept.market-basics::interpret';
    const variants = exerciseVariantsForObjective(objId);
    expect(variants.length).toBeGreaterThan(1);
    const v0 = pickVariant(objId, 0);
    const v1 = pickVariant(objId, 1);
    expect(v0!.id).not.toBe(v1!.id); // variante différente au round suivant
  });

  it('renvoie undefined pour un objectif sans exercice', () => {
    expect(pickVariant('concept.inexistant::recognize', 0)).toBeUndefined();
  });
});
