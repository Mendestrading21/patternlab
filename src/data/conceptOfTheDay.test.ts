import { describe, it, expect } from '@jest/globals';
import { conceptOfTheDay, dayNumber } from './conceptOfTheDay';
import { V5_CONCEPTS } from './learningContent';

const DAY = 86_400_000;

describe('conceptOfTheDay', () => {
  it('dayNumber avance d’une unité par jour', () => {
    expect(dayNumber(10 * DAY) - dayNumber(9 * DAY)).toBe(1);
    expect(dayNumber(5 * DAY + 1000)).toBe(dayNumber(5 * DAY + 80_000_000)); // même jour
  });

  it('renvoie un concept avec visuel, déterministe pour un jour donné', () => {
    const c = conceptOfTheDay(V5_CONCEPTS, 100 * DAY);
    expect(c).not.toBeNull();
    expect(c!.visualSpec).toBeDefined();
    expect(conceptOfTheDay(V5_CONCEPTS, 100 * DAY)!.id).toBe(c!.id); // reproductible
  });

  it('change de concept d’un jour à l’autre (rotation)', () => {
    const ids = [0, 1, 2, 3, 4].map((d) => conceptOfTheDay(V5_CONCEPTS, d * DAY)!.id);
    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  it('boucle sur le corpus (jour N et jour N+taille identiques)', () => {
    const pool = V5_CONCEPTS.filter((c) => c.visualSpec);
    const a = conceptOfTheDay(V5_CONCEPTS, 3 * DAY)!.id;
    const b = conceptOfTheDay(V5_CONCEPTS, (3 + pool.length) * DAY)!.id;
    expect(a).toBe(b);
  });

  it('liste vide → null (sûr)', () => {
    expect(conceptOfTheDay([], 0)).toBeNull();
  });
});
