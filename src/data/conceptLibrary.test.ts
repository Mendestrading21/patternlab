import { describe, it, expect } from '@jest/globals';
import {
  searchConcepts,
  filterConcepts,
  browseConcepts,
  conceptFamilies,
  conceptDifficulties,
} from './conceptLibrary';
import { V5_CONCEPTS } from './learningContent';
import { CATEGORIES } from './learningConcept';

describe('conceptLibrary — recherche & filtres', () => {
  it('recherche vide renvoie tout ; une requête filtre par titre/alias', () => {
    expect(searchConcepts('', V5_CONCEPTS)).toHaveLength(V5_CONCEPTS.length);
    const sample = V5_CONCEPTS[0];
    const hit = searchConcepts(sample.title, V5_CONCEPTS);
    expect(hit.some((c) => c.slug === sample.slug)).toBe(true);
  });

  it('recherche insensible aux accents et à la casse', () => {
    const withAccent = V5_CONCEPTS.find((c) => /[éèêàùç]/i.test(c.title));
    if (withAccent) {
      const stripped = withAccent.title.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
      const hit = searchConcepts(stripped, V5_CONCEPTS);
      expect(hit.some((c) => c.slug === withAccent.slug)).toBe(true);
    }
  });

  it('filtre par famille et par difficulté', () => {
    const cat = V5_CONCEPTS[0].categoryId;
    const byFamily = filterConcepts(V5_CONCEPTS, { categoryId: cat });
    expect(byFamily.length).toBeGreaterThan(0);
    expect(byFamily.every((c) => c.categoryId === cat)).toBe(true);

    const diff = V5_CONCEPTS[0].difficulty;
    const byDiff = filterConcepts(V5_CONCEPTS, { difficulty: diff });
    expect(byDiff.every((c) => c.difficulty === diff)).toBe(true);
  });

  it('browseConcepts combine recherche + filtres', () => {
    const cat = V5_CONCEPTS[0].categoryId;
    const all = browseConcepts(V5_CONCEPTS, {});
    expect(all).toHaveLength(V5_CONCEPTS.length);
    const combined = browseConcepts(V5_CONCEPTS, { categoryId: cat });
    expect(combined.every((c) => c.categoryId === cat)).toBe(true);
  });

  it('conceptFamilies ne liste que des familles présentes, avec un compte exact', () => {
    const fams = conceptFamilies(V5_CONCEPTS, CATEGORIES);
    expect(fams.length).toBeGreaterThan(0);
    const total = fams.reduce((n, f) => n + f.count, 0);
    expect(total).toBe(V5_CONCEPTS.length);
    for (const f of fams) {
      expect(f.count).toBe(V5_CONCEPTS.filter((c) => c.categoryId === f.id).length);
    }
  });

  it('conceptDifficulties renvoie les niveaux présents, triés', () => {
    const diffs = conceptDifficulties(V5_CONCEPTS);
    expect(diffs.length).toBeGreaterThan(0);
    expect([...diffs]).toEqual([...diffs].sort((a, b) => a - b));
  });
});
