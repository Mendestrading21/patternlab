import { describe, it, expect } from '@jest/globals';
import { COMPARISONS, comparison } from './comparisons';
import { CHEAT_SHEETS, cheatSheet } from './cheatSheets';
import { datasetByKey, SUPPORTED_VISUAL_TYPES } from './visualDatasets';

describe('registres vitrine (comparaisons / aide-mémoire)', () => {
  it('les 3 nouveaux types visuels sont supportés', () => {
    for (const t of ['volume-profile', 'comparison', 'cheat-sheet'] as const) {
      expect(SUPPORTED_VISUAL_TYPES).toContain(t);
    }
  });

  it('chaque comparaison référence deux datasets non vides et des légendes', () => {
    for (const [key, c] of Object.entries(COMPARISONS)) {
      expect(key.length).toBeGreaterThan(0);
      for (const side of [c.left, c.right]) {
        expect(datasetByKey(side.datasetKey).length).toBeGreaterThan(0);
        expect(side.caption.trim().length).toBeGreaterThan(0);
      }
      expect(comparison(key)).toBe(c);
    }
  });

  it('chaque aide-mémoire référence des datasets non vides et des libellés', () => {
    for (const [key, items] of Object.entries(CHEAT_SHEETS)) {
      expect(items.length).toBeGreaterThan(0);
      for (const it of items) {
        expect(datasetByKey(it.datasetKey).length).toBeGreaterThan(0);
        expect(it.label.trim().length).toBeGreaterThan(0);
      }
      expect(cheatSheet(key)).toBe(items);
    }
  });
});
