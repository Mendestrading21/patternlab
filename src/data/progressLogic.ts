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
  applySessionGrade,
  coinsForGrade,
  gradeForSession,
  levelForXp,
  xpForGrade,
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
 * Enregistre une réponse d'exercice — ACTIVITÉ uniquement : XP, pièces et errorTags.
 * La maîtrise et la révision espacée ne sont PAS avancées ici : elles se mettent à jour une seule
 * fois par session (`recordSessionReview`), pour qu'une même compétence ne soit pas « révisée »
 * plusieurs fois dans une seule séance (inflation d'intervalle) et pour que le calendrier reflète
 * la précision de la session, pas la dernière réponse.
 * L'XP total progresse exactement du delta d'XP du barème (source unique), donc jamais divergent.
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
  const xpDelta = xpForGrade(grade);
  let updated: SkillProgress = { ...current, xp: current.xp + xpDelta };
  if (grade < 3 && tag) {
    const tags = updated.errorTags ?? {};
    updated = { ...updated, errorTags: { ...tags, [tag]: (tags[tag] ?? 0) + 1 } };
  }
  const totalXp = state.totalXp + xpDelta;
  return {
    ...state,
    totalXp,
    level: levelForXp(totalXp),
    coins: state.coins + coinsForGrade(grade),
    skills: { ...state.skills, [skillId]: updated },
  };
}

/**
 * Planifie la révision espacée d'UNE compétence à partir de la précision de la session
 * (bonnes réponses / total), une seule fois, en fin de session. Met à jour maîtrise, confiance
 * et prochaine échéance via le moteur SM-2. Conséquences (LOT 1 — fiabilité) :
 * - une compétence n'avance que d'un cran de répétition par session (pas par réponse) ;
 * - une session faible (< 60 %) → révision immédiate ; 60–80 % → révision rapprochée ;
 * - le calendrier reflète la performance globale, pas seulement la dernière réponse.
 */
export function recordSessionReview(
  state: ProgressState,
  skillId: string,
  correct: number,
  total: number,
  now: number,
): ProgressState {
  const current: SkillProgress = state.skills[skillId] ?? initialProgress(skillId, now);
  const updated = applySessionGrade(current, gradeForSession(correct, total), now);
  return { ...state, skills: { ...state.skills, [skillId]: updated } };
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
