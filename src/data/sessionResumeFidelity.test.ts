import { describe, it, expect } from '@jest/globals';
import { aggregateAnswered, sanitizeResume, type AnsweredRecord } from './sessionFlow';
import { recordSessionReview, recordTargetSessionReview } from './progressLogic';
import type { ProgressState } from './repositories';
import { PROGRESS_SCHEMA_VERSION } from './repositories';

const T0 = 1_700_000_000_000;

function base(): ProgressState {
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
    learning: undefined,
    targets: {},
    rotation: {},
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  };
}

/** Applique la fin de session (compétences + cibles) comme le fait le contexte, avec un `now` fixe. */
function scoreSession(state: ProgressState, answered: AnsweredRecord[]): ProgressState {
  const { perSkill, perTarget } = aggregateAnswered(answered);
  let next = state;
  for (const s of perSkill) next = recordSessionReview(next, s.skillId, s.correct, s.total, T0);
  next = recordTargetSessionReview(next, perTarget, T0);
  return next;
}

// Un checkpoint multi-compétences : 6 réponses réparties sur 2 compétences et 3 cibles.
const ANSWERED: AnsweredRecord[] = [
  { exerciseId: 'ex.candles.mcq', skillId: 'skill.candles', conceptId: 'concept.candle-anatomy', objectiveId: 'concept.candle-anatomy::interpret', correct: true },
  { exerciseId: 'ex.candles.identify-figure', skillId: 'skill.candles', conceptId: 'concept.candle-anatomy', objectiveId: 'concept.candle-anatomy::recognize', correct: true },
  { exerciseId: 'ex.candles.find', skillId: 'skill.candles', conceptId: 'concept.candle-anatomy', objectiveId: 'concept.candle-anatomy::avoid-false-signal', correct: false },
  { exerciseId: 'ex.patterns.mcq', skillId: 'skill.patterns', conceptId: 'concept.double-bottom', objectiveId: 'concept.double-bottom::interpret', correct: true },
  { exerciseId: 'ex.patterns.identify', skillId: 'skill.patterns', conceptId: 'concept.double-bottom', objectiveId: 'concept.double-bottom::recognize', correct: true },
  { exerciseId: 'ex.patterns.find', skillId: 'skill.patterns', conceptId: 'concept.double-bottom', objectiveId: 'concept.double-bottom::avoid-false-signal', correct: true },
];

describe('reprise de checkpoint — fidélité exacte (P0)', () => {
  it('une session reprise produit EXACTEMENT le même état qu’une session continue', () => {
    // Continu : toutes les réponses d'un coup.
    const continuous = scoreSession(base(), ANSWERED);

    // Reprise : 3 réponses, fermeture (persistance), restauration, puis 3 autres.
    const firstHalf = ANSWERED.slice(0, 3);
    const secondHalf = ANSWERED.slice(3);
    const persisted = { skillId: 'checkpoint.read-chart', phase: 'practice', learnStep: 0, index: 3, correct: 2, streak: 0, count: null, answered: firstHalf };
    const restored = sanitizeResume(persisted, { skillId: 'checkpoint.read-chart' })!;
    const resumedAnswered = [...restored.answered, ...secondHalf];
    const resumed = scoreSession(base(), resumedAnswered);

    expect(resumed.targets).toEqual(continuous.targets);
    expect(resumed.skills).toEqual(continuous.skills);
  });

  it('les réponses données AVANT la fermeture participent au résultat final', () => {
    const firstHalf = ANSWERED.slice(0, 3); // contient concept.candle-anatomy::interpret
    const restored = sanitizeResume(
      { skillId: 'checkpoint.read-chart', phase: 'practice', learnStep: 0, index: 3, correct: 2, streak: 0, count: null, answered: firstHalf },
      { skillId: 'checkpoint.read-chart' },
    )!;
    const final = scoreSession(base(), [...restored.answered, ...ANSWERED.slice(3)]);
    // Une cible vue seulement avant la fermeture est bien présente et comptée.
    expect(final.targets!['concept.candle-anatomy::interpret'].attempts).toBe(1);
    expect(final.targets!['concept.candle-anatomy::interpret'].correct).toBe(1);
  });

  it('aucune réponse restaurée n’est comptée deux fois (attempts = nombre de réponses)', () => {
    const restored = sanitizeResume(
      { skillId: 'checkpoint.read-chart', phase: 'practice', learnStep: 0, index: 3, correct: 2, streak: 0, count: null, answered: ANSWERED.slice(0, 3) },
      { skillId: 'checkpoint.read-chart' },
    )!;
    const final = scoreSession(base(), [...restored.answered, ...ANSWERED.slice(3)]);
    const totalAttempts = Object.values(final.targets!).reduce((n, t) => n + t.attempts, 0);
    expect(totalAttempts).toBe(ANSWERED.length); // 6, pas 9 ni 12
  });

  it('une cible ne reçoit qu’UNE transition par session (répétitions ≤ 1 après une session)', () => {
    const final = scoreSession(base(), ANSWERED);
    for (const t of Object.values(final.targets!)) {
      expect(t.sessions).toBe(1);
      expect(t.review.repetitions).toBeLessThanOrEqual(1);
    }
  });
});
