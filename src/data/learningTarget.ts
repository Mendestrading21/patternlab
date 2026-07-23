// ─── Cible pédagogique canonique ────────────────────────────────────────
// Une « cible » = un couple (conceptId, objectiveId). C'est l'unité que la
// progression, la rotation des exercices et le gating de maîtrise adressent.
//
// Les objectifs ne sont JAMAIS inventés : ils sont dérivés des champs réels du
// concept (learningObjective, definitionShort, confirmationZone, invalidation,
// falseSignals). Un concept expose donc entre 1 et 5 objectifs selon le
// contenu qu'il porte. `recognize` est toujours présent (chaque concept a un
// `learningObjective`).
import type { LearningConcept } from './learningConcept';

export type ObjectiveKind =
  | 'recognize' // Reconnaître la notion / la figure
  | 'interpret' // Interpréter ce qu'elle signifie
  | 'confirm' // Repérer la zone de confirmation
  | 'invalidate' // Situer le niveau d'invalidation
  | 'avoid-false-signal'; // Distinguer un faux signal

/** Ordre canonique des objectifs (pédagogique : reconnaître avant interpréter…). */
export const OBJECTIVE_KINDS: readonly ObjectiveKind[] = [
  'recognize',
  'interpret',
  'confirm',
  'invalidate',
  'avoid-false-signal',
] as const;

/** Libellé court et stable de la nature d'un objectif (UI, a11y). */
export const OBJECTIVE_KIND_LABEL: Record<ObjectiveKind, string> = {
  recognize: 'Reconnaître',
  interpret: 'Interpréter',
  confirm: 'Confirmer',
  invalidate: 'Invalider',
  'avoid-false-signal': 'Éviter le faux signal',
};

export interface LearningObjective {
  /** Identifiant stable et dérivé : `${conceptId}::${kind}`. */
  id: string;
  conceptId: string;
  conceptSlug: string;
  kind: ObjectiveKind;
  /** Phrase pédagogique dérivée du contenu réel du concept (jamais inventée). */
  label: string;
}

/** Une cible pédagogique = un objectif précis d'un concept précis. */
export interface LearningTarget {
  conceptId: string;
  objectiveId: string;
}

/** Construit l'identifiant stable d'un objectif. */
export function objectiveId(conceptId: string, kind: ObjectiveKind): string {
  return `${conceptId}::${kind}`;
}

/** Décompose un objectiveId en (conceptId, kind) ; null si malformé. */
export function parseObjectiveId(id: string): { conceptId: string; kind: ObjectiveKind } | null {
  const idx = id.lastIndexOf('::');
  if (idx <= 0) return null;
  const conceptId = id.slice(0, idx);
  const kind = id.slice(idx + 2) as ObjectiveKind;
  if (!OBJECTIVE_KINDS.includes(kind)) return null;
  return { conceptId, kind };
}

/** Clé unique d'une cible (pour Set/Map). */
export function targetKey(t: LearningTarget): string {
  return `${t.conceptId}|${t.objectiveId}`;
}

function trimTo(s: string, max = 140): string {
  const t = s.trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/**
 * Dérive les objectifs d'un concept à partir de ses champs réels.
 * Toujours au moins `recognize`. Les autres n'apparaissent que si le concept
 * porte le contenu correspondant — pas d'objectif creux.
 */
export function objectivesForConcept(concept: LearningConcept): LearningObjective[] {
  const out: LearningObjective[] = [];
  const add = (kind: ObjectiveKind, label: string | undefined | null) => {
    const value = (label ?? '').trim();
    if (!value) return;
    out.push({
      id: objectiveId(concept.id, kind),
      conceptId: concept.id,
      conceptSlug: concept.slug,
      kind,
      label: trimTo(value),
    });
  };

  // recognize — chaque concept a un learningObjective (garanti par le schéma).
  add('recognize', concept.learningObjective || `Reconnaître : ${concept.title}`);
  // interpret — dérivé de la définition courte.
  if (concept.definitionShort) add('interpret', `Expliquer ce que montre « ${concept.shortTitle} » : ${concept.definitionShort}`);
  // confirm — seulement si une zone de confirmation est documentée.
  if (concept.confirmationZone) add('confirm', `Repérer la zone de confirmation : ${concept.confirmationZone}`);
  // invalidate — seulement si une invalidation est documentée.
  if (concept.invalidation) add('invalidate', `Situer l'invalidation : ${concept.invalidation}`);
  // avoid-false-signal — seulement si des faux signaux sont documentés.
  if (concept.falseSignals && concept.falseSignals.length > 0) {
    add('avoid-false-signal', `Distinguer un faux signal : ${concept.falseSignals[0]}`);
  }

  return out;
}

/** Tous les objectifs d'un corpus, à plat, dans l'ordre canonique par concept. */
export function allLearningObjectives(concepts: LearningConcept[]): LearningObjective[] {
  return concepts.flatMap(objectivesForConcept);
}

/** Index objectiveId → objectif. */
export function objectivesById(concepts: LearningConcept[]): Map<string, LearningObjective> {
  const map = new Map<string, LearningObjective>();
  for (const o of allLearningObjectives(concepts)) map.set(o.id, o);
  return map;
}

/** Index conceptId → objectifs (ordre canonique). */
export function objectivesByConcept(concepts: LearningConcept[]): Map<string, LearningObjective[]> {
  const map = new Map<string, LearningObjective[]>();
  for (const c of concepts) map.set(c.id, objectivesForConcept(c));
  return map;
}

/** Retrouve un objectif par son id dans un corpus. */
export function objectiveByIdIn(concepts: LearningConcept[], id: string): LearningObjective | undefined {
  const parsed = parseObjectiveId(id);
  if (!parsed) return undefined;
  const concept = concepts.find((c) => c.id === parsed.conceptId);
  if (!concept) return undefined;
  return objectivesForConcept(concept).find((o) => o.id === id);
}
