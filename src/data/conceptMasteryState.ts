/**
 * Machine d'états stricte de la maîtrise d'un concept (P0 — progression honnête).
 *
 * Cinq états nettement séparés :
 *   new       — jamais vu
 *   explored  — fiche consultée (ne vaut JAMAIS maîtrise)
 *   completed — au moins une session réussie sur la compétence du concept
 *   strong    — compétence solide (SM-2 haut), mais rétention/checkpoint non prouvés
 *   mastered  — solidité + rétention différée + checkpoint indépendant réussi
 *
 * Deux garde-fous P0 :
 *   1. Un concept qui n'est pas LE concept entraîné de sa compétence (plusieurs
 *      concepts partagent un skillId) n'hérite jamais de la maîtrise — plafond
 *      « exploré ». Fini la maîtrise partagée artificiellement.
 *   2. La maîtrise exige un faisceau de preuves (voir `masteryGate`), pas une
 *      seule bonne réponse ni une simple consultation.
 */
import type { LearningConcept } from './learningConcept';
import { isMastered, masteryStatus, type SkillProgress } from '../engines/learning';
import { conceptSlugForSkill, CHECKPOINT_ID } from './seed';

export type ConceptState = 'new' | 'explored' | 'completed' | 'strong' | 'mastered';

export interface ConceptStateInput {
  exploredSlugs: string[];
  skills: Record<string, SkillProgress>;
  /** Compétences/points de contrôle réussis (contient CHECKPOINT_ID si le checkpoint est passé). */
  completedSkills?: string[];
}

/** Détail des conditions de maîtrise (utile pour l'UI « il te reste à… » et les tests). */
export interface MasteryGate {
  /** Le concept est le représentant entraîné de sa compétence (pas un simple partageur de skillId). */
  representative: boolean;
  /** Au moins une session réussie sur la compétence. */
  trained: boolean;
  /** Réussite sur plusieurs sessions distinctes (≥ 3 rappels consécutifs). */
  multipleSessions: boolean;
  /** Rétention différée démontrée (un rappel réussi après un intervalle réel). */
  deferredRetention: boolean;
  /** Checkpoint indépendant réussi. */
  checkpointPassed: boolean;
  /** Aucun échec récent non résolu (un échec remet les répétitions à zéro). */
  noRecentFailure: boolean;
}

/**
 * Un concept est « représentatif » de sa compétence s'il en est le concept
 * canonique entraîné (`CONCEPT_BY_SKILL`). Les autres concepts qui partagent le
 * même skillId ne sont pas entraînés individuellement : ils ne peuvent pas
 * hériter de la maîtrise de la compétence.
 */
export function isRepresentativeConcept(concept: Pick<LearningConcept, 'skillId' | 'slug'>): boolean {
  return Boolean(concept.skillId) && conceptSlugForSkill(concept.skillId as string) === concept.slug;
}

export function masteryGate(concept: LearningConcept, input: ConceptStateInput): MasteryGate {
  const sp = concept.skillId ? input.skills[concept.skillId] : undefined;
  const reps = sp?.review.repetitions ?? 0;
  const interval = sp?.review.intervalDays ?? 0;
  const completed = input.completedSkills ?? [];
  return {
    representative: isRepresentativeConcept(concept),
    trained: Boolean(sp) && (completed.includes(concept.skillId ?? '') || reps > 0),
    multipleSessions: reps >= 3,
    deferredRetention: reps >= 2 && interval >= 1,
    checkpointPassed: completed.includes(CHECKPOINT_ID),
    noRecentFailure: reps >= 3,
  };
}

/** Toutes les conditions de maîtrise sont-elles réunies ? (faisceau de preuves). */
export function canBeMastered(concept: LearningConcept, input: ConceptStateInput): boolean {
  const g = masteryGate(concept, input);
  const sp = concept.skillId ? input.skills[concept.skillId] : undefined;
  return (
    g.representative &&
    g.trained &&
    g.multipleSessions &&
    g.deferredRetention &&
    g.checkpointPassed &&
    g.noRecentFailure &&
    Boolean(sp && isMastered(sp)) &&
    input.exploredSlugs.includes(concept.slug)
  );
}

/** État de maîtrise strict d'un concept. */
export function conceptState(concept: LearningConcept, input: ConceptStateInput): ConceptState {
  const explored = input.exploredSlugs.includes(concept.slug);
  const sp = concept.skillId ? input.skills[concept.skillId] : undefined;

  // Non représentatif OU sans compétence entraînable : plafond « exploré ».
  if (!isRepresentativeConcept(concept) || !sp) return explored ? 'explored' : 'new';

  if (canBeMastered(concept, input)) return 'mastered';

  // Solide au sens SM-2 (mastery haute ou déjà « mastered ») mais faisceau de preuves
  // incomplet (checkpoint/rétention) → « strong », jamais « mastered ».
  const status = masteryStatus(sp);
  if (status === 'strong' || status === 'mastered') return 'strong';

  const trained = (input.completedSkills ?? []).includes(concept.skillId as string) || (sp.review.repetitions ?? 0) > 0;
  if (trained) return 'completed';
  return explored ? 'explored' : 'new';
}

/** Le concept est-il réellement maîtrisé (état strict) ? */
export function isConceptMastered(concept: LearningConcept, input: ConceptStateInput): boolean {
  return conceptState(concept, input) === 'mastered';
}
