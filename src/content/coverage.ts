/**
 * Couverture de contenu & idempotence — logique pure, testable.
 * Sert de tableau de bord de la montée en charge vers 150 puis 500+ concepts
 * (voie éditoriale V5), et de garde-fou d'idempotence (aucun id/slug dupliqué).
 * Aucune I/O : opère sur des résumés de concepts.
 */
import { CATEGORIES, type Category, type LearningConcept, type ConceptStatus } from '../data/learningConcept';

export interface ConceptSummary {
  id: string;
  slug: string;
  worldId: string;
  categoryId: string;
  status: ConceptStatus;
}

/** Réduit des concepts riches à des résumés (ce qui suffit à mesurer la couverture). */
export function summarizeConcepts(concepts: LearningConcept[]): ConceptSummary[] {
  return concepts.map((c) => ({
    id: c.id,
    slug: c.slug,
    worldId: c.worldId,
    categoryId: c.categoryId,
    status: c.status,
  }));
}

export interface CategoryCoverage {
  id: string;
  label: string;
  target: number;
  count: number;
  /** Pourcentage entier de la cible atteint (borné à 100). */
  pct: number;
}

/** Couverture par catégorie vs cible (target) — triée comme `categories`. */
export function coverageByCategory(
  summaries: ConceptSummary[],
  categories: Category[] = CATEGORIES,
): CategoryCoverage[] {
  return categories.map((cat) => {
    const count = summaries.filter((s) => s.categoryId === cat.id).length;
    const pct = cat.target > 0 ? Math.min(100, Math.round((count / cat.target) * 100)) : 0;
    return { id: cat.id, label: cat.label, target: cat.target, count, pct };
  });
}

export interface Milestone {
  target: number;
  reached: number;
  pct: number;
}

export interface CoverageTotals {
  total: number;
  byStatus: Record<string, number>;
  /** Somme des cibles de toutes les catégories (ambition totale du corpus). */
  targetTotal: number;
  milestones: Milestone[];
}

/** Totaux globaux + progression vers des jalons (150 puis 500 par défaut). */
export function coverageTotals(
  summaries: ConceptSummary[],
  milestoneTargets: number[] = [150, 500],
  categories: Category[] = CATEGORIES,
): CoverageTotals {
  const byStatus: Record<string, number> = {};
  for (const s of summaries) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;
  const targetTotal = categories.reduce((acc, c) => acc + c.target, 0);
  const milestones = milestoneTargets.map((target) => ({
    target,
    reached: summaries.length,
    pct: target > 0 ? Math.min(100, Math.round((summaries.length / target) * 100)) : 0,
  }));
  return { total: summaries.length, byStatus, targetTotal, milestones };
}

export interface IdempotenceIssue {
  kind: 'id' | 'slug';
  value: string;
}

/** Détecte les doublons d'id/slug (idempotence : deux fois le même concept = conflit). */
export function idempotenceIssues(summaries: ConceptSummary[]): IdempotenceIssue[] {
  const issues: IdempotenceIssue[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  for (const s of summaries) {
    if (seenId.has(s.id)) issues.push({ kind: 'id', value: s.id });
    else seenId.add(s.id);
    if (seenSlug.has(s.slug)) issues.push({ kind: 'slug', value: s.slug });
    else seenSlug.add(s.slug);
  }
  return issues;
}
