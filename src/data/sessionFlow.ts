/**
 * Flux de session (pur, testable) — Learning-Master Lot 3.
 *
 * - `buildLearnSteps` garantit un **contre-exemple** (step `falseSignal`) dans la séquence
 *   d'apprentissage : un écran d'apprentissage n'est complet que s'il montre aussi ce qui invalide
 *   ou trompe (exigence de la checklist d'acceptation).
 * - `SessionResume` + `sanitizeResume` modélisent la **reprise exacte** d'une session après
 *   fermeture. La reprise ne s'applique JAMAIS à une autre compétence (contrôle du `skillId`).
 */
import type { LessonStep } from '../engines/learning';

/** Insère un contre-exemple (`falseSignal`) s'il en manque un, juste avant le résumé. */
export function buildLearnSteps(steps: LessonStep[], counterExampleBody?: string): LessonStep[] {
  if (steps.some((s) => s.kind === 'falseSignal')) return steps;
  const counter: LessonStep = {
    id: 'step.counter-example.auto',
    kind: 'falseSignal',
    body:
      counterExampleBody ??
      'Attention au contre-exemple : une configuration qui « ressemble » peut échouer. Vérifie toujours la confirmation avant de conclure.',
  };
  const summaryIdx = steps.findIndex((s) => s.kind === 'summary');
  if (summaryIdx === -1) return [...steps, counter];
  return [...steps.slice(0, summaryIdx), counter, ...steps.slice(summaryIdx)];
}

export type SessionPhase = 'learn' | 'practice';

/**
 * Réponse validée d'une session, conservant sa cible pédagogique. Persistée avec
 * la reprise pour qu'un checkpoint multi-compétences agrège EXACTEMENT les mêmes
 * réponses avec ou sans fermeture intermédiaire.
 */
export interface AnsweredRecord {
  exerciseId: string;
  skillId: string;
  conceptId?: string;
  objectiveId?: string;
  correct: boolean;
}

/** Position exacte d'une session, persistée pour reprise après fermeture. */
export interface SessionResume {
  skillId: string;
  phase: SessionPhase;
  learnStep: number;
  index: number;
  correct: number;
  streak: number;
  count: number | null;
  /** Réponses déjà validées (avec leur cible), pour une agrégation fidèle après reprise. */
  answered: AnsweredRecord[];
  /** En cours de remédiation : id de la variante servie (même cible, ≠ celle échouée). Absent = normal. */
  remediationId?: string;
  /** Brouillon d'une interaction d'ordre EN COURS (indices affichés), pour restaurer une manip inachevée. */
  draftOrder?: number[];
}

/**
 * Valide/assainit un état de reprise. Renvoie `null` si invalide OU si le `skillId` ne correspond
 * pas à la session demandée — on ne reprend jamais un autre contenu silencieusement.
 */
export function sanitizeResume(raw: unknown, opts: { skillId: string }): SessionResume | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<SessionResume>;
  if (r.skillId !== opts.skillId) return null;
  const phase: SessionPhase | null = r.phase === 'practice' ? 'practice' : r.phase === 'learn' ? 'learn' : null;
  if (!phase) return null;
  const nat = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
  const count = typeof r.count === 'number' && Number.isFinite(r.count) && r.count > 0 ? Math.floor(r.count) : null;
  return {
    skillId: opts.skillId,
    phase,
    learnStep: nat(r.learnStep),
    index: nat(r.index),
    correct: nat(r.correct),
    streak: nat(r.streak),
    count,
    answered: sanitizeAnswered(r.answered),
    remediationId: typeof r.remediationId === 'string' ? r.remediationId : undefined,
    draftOrder: sanitizeDraftOrder(r.draftOrder),
  };
}

/** Valide un brouillon d'ordre : tableau d'indices entiers positifs, sinon indéfini. */
function sanitizeDraftOrder(raw: unknown): number[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: number[] = [];
  for (const v of raw) {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return undefined;
    out.push(Math.floor(v));
  }
  return out;
}

/** Assainit la liste des réponses persistées (garde exerciseId + skillId + cible + résultat). */
function sanitizeAnswered(raw: unknown): AnsweredRecord[] {
  if (!Array.isArray(raw)) return [];
  const out: AnsweredRecord[] = [];
  for (const a of raw) {
    if (!a || typeof a !== 'object') continue;
    const rec = a as Partial<AnsweredRecord>;
    if (typeof rec.exerciseId !== 'string' || typeof rec.skillId !== 'string') continue;
    out.push({
      exerciseId: rec.exerciseId,
      skillId: rec.skillId,
      conceptId: typeof rec.conceptId === 'string' ? rec.conceptId : undefined,
      objectiveId: typeof rec.objectiveId === 'string' ? rec.objectiveId : undefined,
      correct: Boolean(rec.correct),
    });
  }
  return out;
}

/** Une reprise vaut la peine d'être proposée si elle a dépassé le tout début. */
export function isResumable(resume: SessionResume | null): boolean {
  if (!resume) return false;
  return resume.phase === 'practice' || resume.learnStep > 0 || resume.index > 0 || resume.correct > 0;
}

export interface PerSkillResult {
  skillId: string;
  correct: number;
  total: number;
}
export interface PerTargetResult {
  objectiveId: string;
  conceptId: string;
  correct: number;
  total: number;
}

/**
 * Agrège les réponses validées d'une session, par compétence ET par cible.
 * Fonction pure et partagée : l'écran et les tests l'utilisent, si bien qu'une
 * session reprise (réponses restaurées via `sanitizeResume`) produit exactement
 * la même agrégation qu'une session continue.
 */
export function aggregateAnswered(answered: AnsweredRecord[]): {
  perSkill: PerSkillResult[];
  perTarget: PerTargetResult[];
} {
  const skill: Record<string, PerSkillResult> = {};
  const target: Record<string, PerTargetResult> = {};
  for (const a of answered) {
    const s = skill[a.skillId] ?? { skillId: a.skillId, correct: 0, total: 0 };
    s.total += 1;
    if (a.correct) s.correct += 1;
    skill[a.skillId] = s;
    if (a.objectiveId) {
      const t = target[a.objectiveId] ?? { objectiveId: a.objectiveId, conceptId: a.conceptId ?? '', correct: 0, total: 0 };
      t.total += 1;
      if (a.correct) t.correct += 1;
      target[a.objectiveId] = t;
    }
  }
  return { perSkill: Object.values(skill), perTarget: Object.values(target) };
}
