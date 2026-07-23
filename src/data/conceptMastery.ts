/**
 * Statut d'apprentissage d'un concept (Learning-Master Lot 8) — pur, testable.
 *
 * Distingue honnêtement la simple **découverte** (fiche consultée) de la **maîtrise**.
 * P0 : la maîtrise s'appuie désormais sur la machine d'états stricte
 * (`conceptMasteryState`) — un concept `strong` (solide mais non prouvé dans le temps
 * ni au checkpoint) n'est PLUS présenté comme `Maîtrisé`, et un concept qui partage un
 * skillId sans être le concept entraîné n'hérite pas de la maîtrise.
 *
 * `label` reste volontairement à 3 valeurs (compat des filtres existants) ; `state`
 * et `stateLabel` exposent la granularité fine (En cours / Solide / Maîtrisé).
 */
import type { LearningConcept } from './learningConcept';
import type { SkillProgress } from '../engines/learning';
import type { TargetProgress } from './targetProgress';
import { conceptState, type ConceptState } from './conceptMasteryState';

export type ConceptStatusLabel = 'Nouveau' | 'Découvert' | 'Maîtrisé';

export interface ConceptLearningStatus {
  /** Libellé grossier (3 valeurs) — conserve la compatibilité des filtres. */
  label: ConceptStatusLabel;
  /** État strict sous-jacent (5 valeurs). */
  state: ConceptState;
  /** Libellé fin de l'état strict (Nouveau / Découvert / En cours / Solide / Maîtrisé). */
  stateLabel: string;
  explored: boolean;
  mastered: boolean;
}

export interface ConceptMasteryInput {
  exploredSlugs: string[];
  skills: Record<string, SkillProgress>;
  /** Compétences/points de contrôle réussis. Sans cette donnée, la maîtrise reste prudente (jamais accordée). */
  completedSkills?: string[];
  /** Progression par cible (schéma v8) — source de la couverture des objectifs. */
  targets?: Record<string, TargetProgress>;
}

const STATE_LABEL: Record<ConceptState, string> = {
  new: 'Nouveau',
  explored: 'Découvert',
  completed: 'En cours',
  strong: 'Solide',
  mastered: 'Maîtrisé',
};

function coarseLabel(state: ConceptState): ConceptStatusLabel {
  if (state === 'mastered') return 'Maîtrisé';
  if (state === 'new') return 'Nouveau';
  return 'Découvert';
}

export function conceptMasteryStatus(concept: LearningConcept, input: ConceptMasteryInput): ConceptLearningStatus {
  const state = conceptState(concept, {
    exploredSlugs: input.exploredSlugs,
    skills: input.skills,
    completedSkills: input.completedSkills,
    targets: input.targets,
  });
  return {
    label: coarseLabel(state),
    state,
    stateLabel: STATE_LABEL[state],
    explored: state !== 'new',
    mastered: state === 'mastered',
  };
}
