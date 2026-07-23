// ─── Progression par cible pédagogique ──────────────────────────────────
// La progression était appliquée par `skillId` : deux objectifs d'une même
// compétence (et deux concepts partageant un skillId) partageaient donc leur
// avancement. Ce module porte la progression au niveau de la CIBLE
// (`objectiveId`), avec sa propre planification SM-2, pour que chaque objectif
// avance indépendamment et que la couverture serve de preuve à la maîtrise.
import { gradeForSession, initialReview, scheduleNext, type ReviewState } from '../engines/learning';

/** Progression persistée d'une cible pédagogique (un objectif d'un concept). */
export interface TargetProgress {
  objectiveId: string;
  conceptId: string;
  /** Réponses totales cumulées sur cette cible. */
  attempts: number;
  /** Réponses correctes cumulées. */
  correct: number;
  /** Nombre de sessions distinctes où la cible a été révisée (≤ une transition par session). */
  sessions: number;
  /** Dernier résultat agrégé de session (majoritairement correct) — pour la remédiation. */
  lastCorrect: boolean;
  /** Planification espacée propre à la cible. */
  review: ReviewState;
}

/** Résultat agrégé d'une cible sur UNE session. */
export interface TargetSessionResult {
  objectiveId: string;
  conceptId: string;
  correct: number;
  total: number;
}

/** Répétitions/intervalle minimaux prouvant la rétention différée d'un objectif. */
export const MASTERY_MIN_REPS = 2;

export function initialTargetProgress(objectiveId: string, conceptId: string, now: number): TargetProgress {
  return { objectiveId, conceptId, attempts: 0, correct: 0, sessions: 0, lastCorrect: false, review: initialReview(now) };
}

/**
 * Applique les résultats d'UNE session : au plus **une** transition SM-2 par cible
 * (une entrée par objectiveId dans `results`). Idempotence de session garantie par
 * l'appelant qui agrège d'abord toutes les réponses par cible.
 */
export function applyTargetSessionResults(
  targets: Record<string, TargetProgress>,
  results: TargetSessionResult[],
  now: number,
): Record<string, TargetProgress> {
  const out: Record<string, TargetProgress> = { ...targets };
  for (const r of results) {
    if (!r.objectiveId || r.total <= 0) continue;
    const cur = out[r.objectiveId] ?? initialTargetProgress(r.objectiveId, r.conceptId, now);
    const grade = gradeForSession(r.correct, r.total);
    out[r.objectiveId] = {
      ...cur,
      conceptId: r.conceptId || cur.conceptId,
      attempts: cur.attempts + r.total,
      correct: cur.correct + r.correct,
      sessions: cur.sessions + 1,
      lastCorrect: r.correct * 2 >= r.total, // majoritairement correct
      review: scheduleNext(cur.review, grade, now), // UNE seule transition
    };
  }
  return out;
}

/** Une cible est « prouvée » : entraînée avec succès ET retenue dans le temps. */
export function isObjectiveProven(t: TargetProgress | undefined): boolean {
  return Boolean(t && t.correct > 0 && t.review.repetitions >= MASTERY_MIN_REPS && t.review.intervalDays >= 1);
}

/** Une cible a-t-elle été entraînée au moins une fois avec succès ? */
export function isObjectiveTrained(t: TargetProgress | undefined): boolean {
  return Boolean(t && t.correct > 0);
}

/**
 * Couverture d'un ensemble d'objectifs exerçables : part des objectifs prouvés.
 * `exercisable` = objectifs qui possèdent au moins un exercice (donc réellement
 * entraînables). Retourne { proven, trained, total, complete }.
 */
export function objectiveCoverage(
  exercisable: string[],
  targets: Record<string, TargetProgress>,
): { proven: number; trained: number; total: number; complete: boolean } {
  const total = exercisable.length;
  let proven = 0;
  let trained = 0;
  for (const objId of exercisable) {
    const t = targets[objId];
    if (isObjectiveTrained(t)) trained += 1;
    if (isObjectiveProven(t)) proven += 1;
  }
  return { proven, trained, total, complete: total > 0 && proven === total };
}
