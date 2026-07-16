/**
 * Répétition espacée — variante SM-2, versionnée et testée.
 * Sépare XP (activité), mastery (compétence), confidence (stabilité), reviewDueAt (prochaine révision).
 * Règle kit : ne JAMAIS présenter une compétence comme maîtrisée après une seule bonne réponse.
 */

export const SR_VERSION = 1;

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Qualité de rappel : 0 (oubli total) … 5 (parfait). */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewState {
  /** Nombre de rappels réussis consécutifs. */
  repetitions: number;
  /** Facilité (easiness factor), ≥ 1.3. */
  easiness: number;
  /** Intervalle courant en jours. */
  intervalDays: number;
  /** Prochaine échéance (timestamp ms). */
  dueAt: number;
}

export interface SkillProgress {
  skillId: string;
  xp: number;
  /** 0 → 1. */
  mastery: number;
  /** 0 → 1. */
  confidence: number;
  review: ReviewState;
}

export function initialReview(now: number): ReviewState {
  return { repetitions: 0, easiness: 2.5, intervalDays: 0, dueAt: now };
}

export function initialProgress(skillId: string, now: number): SkillProgress {
  return { skillId, xp: 0, mastery: 0, confidence: 0, review: initialReview(now) };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Calcule le prochain état de révision (SM-2). */
export function scheduleNext(state: ReviewState, grade: Grade, now: number): ReviewState {
  const nextEasiness = Math.max(
    1.3,
    state.easiness + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
  );

  if (grade < 3) {
    // rappel raté : on repart, révision très rapprochée
    return { repetitions: 0, easiness: nextEasiness, intervalDays: 0, dueAt: now };
  }

  const repetitions = state.repetitions + 1;
  let intervalDays: number;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(state.intervalDays * nextEasiness);

  return { repetitions, easiness: nextEasiness, intervalDays, dueAt: now + intervalDays * DAY_MS };
}

/** Met à jour mastery + confidence (progressif, jamais « maîtrisé » d'un coup). */
export function applyGrade(progress: SkillProgress, grade: Grade, now: number): SkillProgress {
  const delta = grade >= 4 ? 0.15 : grade === 3 ? 0.07 : -0.12;
  const mastery = clamp01(progress.mastery + delta);
  const confidence = clamp01(progress.confidence * 0.6 + (grade >= 3 ? 0.4 : 0));
  const xp = progress.xp + (grade >= 3 ? 10 : 2);
  return {
    ...progress,
    xp,
    mastery,
    confidence,
    review: scheduleNext(progress.review, grade, now),
  };
}

/** Une compétence est maîtrisée après plusieurs rappels réussis ET une mastery haute. */
export function isMastered(progress: SkillProgress): boolean {
  return progress.review.repetitions >= 3 && progress.mastery >= 0.8;
}

export function isDue(state: ReviewState, now: number): boolean {
  return now >= state.dueAt;
}
