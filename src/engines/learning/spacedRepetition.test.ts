import { describe, it, expect } from '@jest/globals';
import {
  SR_VERSION,
  DAY_MS,
  initialProgress,
  initialReview,
  scheduleNext,
  applyGrade,
  isMastered,
  isDue,
} from './spacedRepetition';

const T0 = 1_700_000_000_000; // timestamp fixe et reproductible

describe('spacedRepetition (SM-2)', () => {
  it('expose une version', () => {
    expect(SR_VERSION).toBe(1);
  });

  it('planifie 1 jour puis 6 jours sur deux rappels réussis', () => {
    const s0 = initialReview(T0);
    const s1 = scheduleNext(s0, 5, T0);
    expect(s1.repetitions).toBe(1);
    expect(s1.intervalDays).toBe(1);
    expect(s1.dueAt).toBe(T0 + 1 * DAY_MS);

    const s2 = scheduleNext(s1, 5, s1.dueAt);
    expect(s2.repetitions).toBe(2);
    expect(s2.intervalDays).toBe(6);
  });

  it('remet à zéro et rapproche la révision sur un échec', () => {
    const s1 = scheduleNext(initialReview(T0), 5, T0);
    const failed = scheduleNext(s1, 1, s1.dueAt);
    expect(failed.repetitions).toBe(0);
    expect(failed.intervalDays).toBe(0);
    expect(isDue(failed, s1.dueAt)).toBe(true);
  });

  it('ne présente jamais une compétence comme maîtrisée après une seule bonne réponse', () => {
    let p = initialProgress('skill.actions', T0);
    p = applyGrade(p, 5, T0);
    expect(isMastered(p)).toBe(false);
    expect(p.mastery).toBeLessThan(0.8);
    expect(p.xp).toBe(10);
  });

  it('atteint la maîtrise après plusieurs bons rappels', () => {
    let p = initialProgress('skill.actions', T0);
    let now = T0;
    for (let i = 0; i < 6; i++) {
      p = applyGrade(p, 5, now);
      now = p.review.dueAt;
    }
    expect(isMastered(p)).toBe(true);
  });

  it('garde l’easiness au-dessus du plancher 1.3', () => {
    let s = initialReview(T0);
    for (let i = 0; i < 10; i++) s = scheduleNext(s, 0, T0);
    expect(s.easiness).toBeGreaterThanOrEqual(1.3);
  });
});
