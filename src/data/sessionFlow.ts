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

/** Position exacte d'une session, persistée pour reprise après fermeture. */
export interface SessionResume {
  skillId: string;
  phase: SessionPhase;
  learnStep: number;
  index: number;
  correct: number;
  streak: number;
  count: number | null;
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
  };
}

/** Une reprise vaut la peine d'être proposée si elle a dépassé le tout début. */
export function isResumable(resume: SessionResume | null): boolean {
  if (!resume) return false;
  return resume.phase === 'practice' || resume.learnStep > 0 || resume.index > 0 || resume.correct > 0;
}
