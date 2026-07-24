import { describe, it, expect } from '@jest/globals';
import { scrambledDisplayOrder, sameOrder } from './reorder';

describe('scrambledDisplayOrder — ordre d’affichage jamais résolu, déterministe', () => {
  it('renvoie une permutation des mêmes indices, JAMAIS égale à la solution (n ≥ 2)', () => {
    for (const correct of [
      [0, 1, 2, 3],
      [2, 1, 0],
      [1, 0, 3, 2],
      [0, 1],
      [3, 0, 2, 1, 4],
    ]) {
      const shown = scrambledDisplayOrder(correct);
      expect([...shown].sort((a, b) => a - b)).toEqual([...correct].sort((a, b) => a - b)); // mêmes éléments
      expect(sameOrder(shown, correct)).toBe(false); // jamais la solution au départ
    }
  });

  it('est déterministe (aucun hasard) : deux appels donnent le même ordre', () => {
    expect(scrambledDisplayOrder([0, 1, 2, 3])).toEqual(scrambledDisplayOrder([0, 1, 2, 3]));
    expect(scrambledDisplayOrder([0, 1, 2, 3])).toEqual([3, 2, 1, 0]);
  });

  it('cas dégénérés (0 ou 1 élément) : rien à mélanger', () => {
    expect(scrambledDisplayOrder([])).toEqual([]);
    expect(scrambledDisplayOrder([0])).toEqual([0]);
  });
});
