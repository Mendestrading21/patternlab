import { describe, it, expect } from '@jest/globals';
import { buildWorldOverview, worldsWithContent } from './worldOverview';
import { WORLDS, conceptBySlug } from './learningConcept';
import { V5_CONCEPTS } from './learningContent';

const overview = buildWorldOverview(WORLDS, V5_CONCEPTS);

describe('buildWorldOverview', () => {
  it('couvre les 15 mondes, triés par ordre croissant', () => {
    expect(overview).toHaveLength(WORLDS.length);
    expect(WORLDS.length).toBe(15);
    const orders = overview.map((s) => s.world.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('marque hasContent + firstConceptSlug pour les mondes ayant des concepts', () => {
    for (const s of overview) {
      expect(s.hasContent).toBe(s.conceptCount > 0);
      if (s.hasContent) {
        expect(s.firstConceptSlug).toBeTruthy();
        const c = conceptBySlug(V5_CONCEPTS, s.firstConceptSlug!);
        expect(c?.worldId).toBe(s.world.id);
      } else {
        expect(s.firstConceptSlug).toBeNull();
      }
    }
  });

  it('les 3 mondes amorce ont du contenu', () => {
    const byId = new Map(overview.map((s) => [s.world.id, s]));
    for (const id of ['world.candles', 'world.patterns', 'world.support-resistance']) {
      expect(byId.get(id)?.hasContent).toBe(true);
    }
  });

  it('worldsWithContent compte les mondes non vides (≥ 3 aujourd’hui, ≤ 15)', () => {
    const n = worldsWithContent(overview);
    expect(n).toBeGreaterThanOrEqual(3);
    expect(n).toBeLessThanOrEqual(WORLDS.length);
    // cohérence : somme des concepts ≥ nombre de mondes couverts
    const totalConcepts = overview.reduce((acc, s) => acc + s.conceptCount, 0);
    expect(totalConcepts).toBeGreaterThanOrEqual(n);
  });
});
