/**
 * Logique de progression — pure, déterministe et testable (aucune I/O, `now` injecté).
 * Le contexte React (progressContext) se contente d'appeler ces fonctions, de persister
 * et d'émettre les événements analytics.
 *
 * Invariants garantis ici (LOT 0 — Fiabilité) :
 * - l'XP total est TOUJOURS l'accumulation des deltas d'XP renvoyés par le moteur
 *   (source unique de vérité), donc jamais divergent de l'XP par compétence ;
 * - le niveau est toujours recalculé depuis l'XP total ;
 * - une compétence n'est débloquée (ajoutée à `completedSkills`) que si la session est
 *   réussie — impossible de débloquer le parcours en échouant ;
 * - aucune double attribution : les transitions sont idempotentes sur une même journée
 *   et ne dupliquent jamais une compétence déjà terminée.
 */
import {
  applyGrade,
  coinsForGrade,
  levelForXp,
  initialProgress,
  type Grade,
  type SkillProgress,
} from '../engines/learning';
import type { ProgressState } from './repositories';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Clé de jour locale AAAA-MM-JJ (base du calcul de série). */
export function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/**
 * Enregistre une réponse d'exercice.
 * L'XP total progresse exactement du delta d'XP produit par le moteur pour cette
 * compétence — pas d'un second barème recopié — ce qui élimine toute incohérence
 * entre l'XP affiché (total) et l'XP enregistré (par compétence).
 */
export function recordAnswer(
  state: ProgressState,
  skillId: string,
  grade: Grade,
  now: number,
  /** Tag d'erreur (id d'exercice/concept) à enregistrer si la réponse est fausse. */
  tag?: string,
): ProgressState {
  const current: SkillProgress = state.skills[skillId] ?? initialProgress(skillId, now);
  let updated = applyGrade(current, grade, now);
  // Erreur → errorTag (concept à retravailler) + révision déjà rapprochée par le moteur.
  if (grade < 3 && tag) {
    const tags = updated.errorTags ?? {};
    updated = { ...updated, errorTags: { ...tags, [tag]: (tags[tag] ?? 0) + 1 } };
  }
  const xpDelta = updated.xp - current.xp;
  const totalXp = state.totalXp + xpDelta;
  return {
    ...state,
    totalXp,
    level: levelForXp(totalXp),
    coins: state.coins + coinsForGrade(grade),
    skills: { ...state.skills, [skillId]: updated },
  };
}

/** Résultat d'une fin de session : le nouvel état + si une compétence vient d'être débloquée. */
export interface SessionCompletion {
  state: ProgressState;
  unlockedSkillId: string | null;
}

/**
 * Termine une session.
 * - La série (streak) est mise à jour dès qu'une session est terminée aujourd'hui
 *   (idempotent sur la journée : rejouer ne l'incrémente pas deux fois).
 * - La compétence n'est marquée terminée (et la suivante débloquée) QUE si `passed`.
 */
export function completeSession(
  state: ProgressState,
  skillId: string | undefined,
  passed: boolean,
  now: number,
): SessionCompletion {
  const today = dayKey(now);
  let streakDays = state.streakDays;
  if (state.lastActiveDate !== today) {
    const yesterday = dayKey(now - DAY_MS);
    streakDays = state.lastActiveDate === yesterday ? state.streakDays + 1 : 1;
  }

  const shouldUnlock = passed && !!skillId && !state.completedSkills.includes(skillId);
  const completedSkills = shouldUnlock
    ? [...state.completedSkills, skillId as string]
    : state.completedSkills;

  return {
    state: { ...state, streakDays, lastActiveDate: today, completedSkills },
    unlockedSkillId: shouldUnlock ? (skillId as string) : null,
  };
}
