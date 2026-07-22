import { describe, it, expect } from '@jest/globals';
import { TRADEMY_ICON_NAMES } from './TrademyIcon';

/**
 * Verrou du système d'icônes Trademy (Lot 2). Garantit que les icônes de navigation et
 * d'action existent (aucun emoji système en substitut) et que le registre est cohérent.
 */
describe('Système d’icônes Trademy', () => {
  it('couvre les cinq espaces de navigation', () => {
    for (const nav of ['home', 'learn', 'library', 'lab', 'profile'] as const) {
      expect(TRADEMY_ICON_NAMES).toContain(nav);
    }
  });

  it('fournit les icônes d’action essentielles', () => {
    for (const action of ['search', 'star', 'chevron-right', 'close', 'check', 'lock', 'play', 'chart'] as const) {
      expect(TRADEMY_ICON_NAMES).toContain(action);
    }
  });

  it('n’a aucun doublon de nom', () => {
    expect(new Set(TRADEMY_ICON_NAMES).size).toBe(TRADEMY_ICON_NAMES.length);
  });

  it('expose un jeu d’icônes non trivial', () => {
    expect(TRADEMY_ICON_NAMES.length).toBeGreaterThanOrEqual(20);
  });
});
