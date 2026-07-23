import { describe, it, expect } from '@jest/globals';
import { PRIMARY_SPACES, HIDDEN_TAB_ROUTES } from './navigation';
import { TRADEMY_ICON_NAMES } from '@/design-system';

/**
 * Verrou de l'architecture de navigation Trademy (Lot 3). Les cinq espaces canoniques,
 * dans l'ordre, avec des icônes du système Trademy et des routes uniques.
 */
describe('Navigation principale Trademy', () => {
  it('expose exactement cinq espaces, dans l’ordre canonique', () => {
    expect(PRIMARY_SPACES.map((s) => s.title)).toEqual([
      'Accueil',
      'Apprendre',
      'Bibliothèque',
      'Laboratoire',
      'Profil',
    ]);
  });

  it('chaque espace pointe une route unique', () => {
    const names = PRIMARY_SPACES.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('chaque icône appartient au système d’icônes Trademy', () => {
    for (const space of PRIMARY_SPACES) {
      expect(TRADEMY_ICON_NAMES).toContain(space.icon);
    }
  });

  it('les écrans hors-barre ne réapparaissent pas dans la barre', () => {
    const visible = new Set(PRIMARY_SPACES.map((s) => s.name));
    for (const hidden of HIDDEN_TAB_ROUTES) {
      expect(visible.has(hidden)).toBe(false);
    }
  });
});
