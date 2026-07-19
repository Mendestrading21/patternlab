import { describe, it, expect } from '@jest/globals';
import {
  summarizeConcepts,
  coverageByCategory,
  coverageTotals,
  idempotenceIssues,
  type ConceptSummary,
} from './coverage';
import { V5_CONCEPTS } from '../data/learningContent';
import { CATEGORIES } from '../data/learningConcept';

const summaries = summarizeConcepts(V5_CONCEPTS);

describe('summarizeConcepts', () => {
  it('résume chaque concept (id/slug/world/category/status)', () => {
    expect(summaries).toHaveLength(V5_CONCEPTS.length);
    expect(summaries[0]).toHaveProperty('id');
    expect(summaries[0]).toHaveProperty('categoryId');
    expect(summaries.every((s) => s.status === 'needsReview')).toBe(true);
  });
});

describe('coverageByCategory', () => {
  it('compte par catégorie vs cible, borné à 100 %', () => {
    const cov = coverageByCategory(summaries);
    expect(cov).toHaveLength(CATEGORIES.length);
    const candles = cov.find((c) => c.id === 'cat.candles')!;
    expect(candles.count).toBeGreaterThanOrEqual(4); // marteau, doji, étoile filante, avalement
    expect(candles.target).toBeGreaterThan(0);
    for (const c of cov) expect(c.pct).toBeLessThanOrEqual(100);
    // la somme des comptes = taille du corpus
    expect(cov.reduce((a, c) => a + c.count, 0)).toBe(V5_CONCEPTS.length);
  });
});

describe('coverageTotals', () => {
  it('totalise et calcule la progression vers 150 / 500', () => {
    const t = coverageTotals(summaries);
    expect(t.total).toBe(V5_CONCEPTS.length);
    expect(t.byStatus.needsReview).toBe(V5_CONCEPTS.length);
    expect(t.targetTotal).toBe(CATEGORIES.reduce((a, c) => a + c.target, 0));
    expect(t.milestones.map((m) => m.target)).toEqual([150, 500]);
    expect(t.milestones[0].pct).toBe(Math.round((V5_CONCEPTS.length / 150) * 100));
  });
});

describe('idempotenceIssues', () => {
  it('aucun doublon sur le corpus réel', () => {
    expect(idempotenceIssues(summaries)).toEqual([]);
  });
  it('détecte un id et un slug dupliqués', () => {
    const dup: ConceptSummary[] = [
      { id: 'concept.a', slug: 'a', worldId: 'world.candles', categoryId: 'cat.candles', status: 'needsReview' },
      { id: 'concept.a', slug: 'b', worldId: 'world.candles', categoryId: 'cat.candles', status: 'needsReview' },
      { id: 'concept.c', slug: 'a', worldId: 'world.candles', categoryId: 'cat.candles', status: 'needsReview' },
    ];
    const issues = idempotenceIssues(dup);
    expect(issues).toContainEqual({ kind: 'id', value: 'concept.a' });
    expect(issues).toContainEqual({ kind: 'slug', value: 'a' });
  });
});
