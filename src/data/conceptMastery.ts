/**
 * Statut d'apprentissage d'un concept (Learning-Master Lot 8) — pur, testable.
 *
 * Distingue honnêtement la simple **découverte** (fiche consultée) de la **maîtrise** (la compétence
 * liée est solide/maîtrisée). Répond au P1 « progression gonflable : voir = exploré » — voir une
 * fiche ne vaut jamais maîtrise.
 */
import type { LearningConcept } from './learningConcept';
import { masteryStatus, type SkillProgress } from '../engines/learning';

export type ConceptStatusLabel = 'Nouveau' | 'Découvert' | 'Maîtrisé';

export interface ConceptLearningStatus {
  label: ConceptStatusLabel;
  explored: boolean;
  mastered: boolean;
}

export interface ConceptMasteryInput {
  exploredSlugs: string[];
  skills: Record<string, SkillProgress>;
}

export function conceptMasteryStatus(concept: LearningConcept, input: ConceptMasteryInput): ConceptLearningStatus {
  const explored = input.exploredSlugs.includes(concept.slug);
  const sp = concept.skillId ? input.skills[concept.skillId] : undefined;
  const status = sp ? masteryStatus(sp) : undefined;
  const mastered = status === 'strong' || status === 'mastered';
  if (mastered) return { label: 'Maîtrisé', explored: true, mastered: true };
  return { label: explored ? 'Découvert' : 'Nouveau', explored, mastered: false };
}
