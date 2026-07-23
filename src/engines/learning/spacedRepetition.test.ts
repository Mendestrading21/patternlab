import { describe, it, expect } from '@jest/globals';
import {
  SR_VERSION,
  DAY_MS,
  initialProgress,
  initialReview,
  scheduleNext,
  applyGrade,
  applySessionGrade,
  gradeForSession,
  isMastered,
  isDue,
  xpForGrade,
  coinsForGrade,
  levelForXp,
  masteryStatus,
  errorCount,
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

describe('barème de récompense (source unique de vérité)', () => {
  it('xpForGrade : 10 si réussi (grade ≥ 3), sinon 2', () => {
    expect(xpForGrade(5)).toBe(10);
    expect(xpForGrade(3)).toBe(10);
    expect(xpForGrade(2)).toBe(2);
    expect(xpForGrade(0)).toBe(2);
  });

  it('coinsForGrade : 5 si réussi, sinon 0', () => {
    expect(coinsForGrade(5)).toBe(5);
    expect(coinsForGrade(2)).toBe(0);
  });

  it('applyGrade utilise exactement xpForGrade', () => {
    const p = initialProgress('skill.a', T0);
    expect(applyGrade(p, 5, T0).xp).toBe(p.xp + xpForGrade(5));
    expect(applyGrade(p, 2, T0).xp).toBe(p.xp + xpForGrade(2));
  });

  it('levelForXp : 100 XP par niveau, jamais sous 1', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(350)).toBe(4);
    expect(levelForXp(-50)).toBe(1);
  });
});

describe('maîtrise adaptative', () => {
  const sp = (over: Partial<import('./spacedRepetition').SkillProgress> = {}) => ({
    skillId: 's',
    xp: 0,
    mastery: 0,
    confidence: 0,
    review: { repetitions: 0, easiness: 2.5, intervalDays: 0, dueAt: 0 },
    ...over,
  });

  it('masteryStatus suit l’échelle new → mastered', () => {
    expect(masteryStatus(sp())).toBe('new');
    expect(masteryStatus(sp({ mastery: 0.2 }))).toBe('learning');
    expect(masteryStatus(sp({ mastery: 0.6, confidence: 0.2 }))).toBe('fragile');
    expect(masteryStatus(sp({ mastery: 0.6, confidence: 0.6 }))).toBe('reviewing');
    expect(masteryStatus(sp({ mastery: 0.85, review: { repetitions: 2, easiness: 2.5, intervalDays: 6, dueAt: 0 } }))).toBe('strong');
    expect(masteryStatus(sp({ mastery: 0.85, review: { repetitions: 3, easiness: 2.5, intervalDays: 15, dueAt: 0 } }))).toBe('mastered');
  });

  it('errorCount somme les errorTags (0 si absent)', () => {
    expect(errorCount(sp())).toBe(0);
    expect(errorCount(sp({ errorTags: { a: 2, b: 1 } }))).toBe(3);
  });
});

describe('gradeForSession (note agrégée d’une session)', () => {
  it('≥ 80 % → 5, 60–80 % → 3, < 60 % → 2', () => {
    expect(gradeForSession(10, 10)).toBe(5);
    expect(gradeForSession(8, 10)).toBe(5);
    expect(gradeForSession(7, 10)).toBe(3);
    expect(gradeForSession(6, 10)).toBe(3);
    expect(gradeForSession(5, 10)).toBe(2);
    expect(gradeForSession(3, 5)).toBe(3); // 60 % exactement → note 3
    expect(gradeForSession(2, 5)).toBe(2); // 40 % → note 2
  });

  it('total nul → 2 (pas de division par zéro)', () => {
    expect(gradeForSession(0, 0)).toBe(2);
  });

  it('une session faible (60 %) programme une révision PROCHE ; une session ratée, immédiate', () => {
    const p = initialProgress('s', T0);
    // 60 % (note 3) : rappel juste → première révision à 1 jour (proche), pas lointaine.
    const weak = applySessionGrade(p, gradeForSession(6, 10), T0);
    expect(weak.review.intervalDays).toBe(1);
    // < 60 % (note 2) : échec → révision immédiate (due maintenant).
    const failed = applySessionGrade(p, gradeForSession(4, 10), T0);
    expect(failed.review.dueAt).toBe(T0);
    expect(isDue(failed.review, T0)).toBe(true);
  });
});

describe('applySessionGrade (maîtrise + révision, SANS XP)', () => {
  it('avance la révision et la maîtrise mais ne touche jamais l’XP', () => {
    const p = { ...initialProgress('s', T0), xp: 42 };
    const after = applySessionGrade(p, 5, T0);
    expect(after.xp).toBe(42); // XP inchangé (récompense d’activité, comptée par réponse)
    expect(after.review.repetitions).toBe(1);
    expect(after.mastery).toBeGreaterThan(p.mastery);
  });

  it('applyGrade = applySessionGrade + XP (comportement historique préservé)', () => {
    const p = initialProgress('s', T0);
    const full = applyGrade(p, 5, T0);
    const sess = applySessionGrade(p, 5, T0);
    expect(full.review).toEqual(sess.review);
    expect(full.mastery).toBe(sess.mastery);
    expect(full.xp).toBe(p.xp + xpForGrade(5));
  });
});
