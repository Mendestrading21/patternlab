import { describe, it, expect } from '@jest/globals';
import { GUIDE_ROLE, GUIDE_PRESENT_STATE } from './guideRoles';
import { CHARACTER_NAME } from './types';

describe('GuideSelectionCard — rôles pédagogiques (canon Toto/Bobo)', () => {
  it('les deux guides existent avec un nom canonique (Bobo, pas Bono/Bruno)', () => {
    expect(CHARACTER_NAME.toto).toBe('Toto');
    expect(CHARACTER_NAME.bobo).toBe('Bobo');
  });

  it('Toto = hypothèse/reprise ; Bobo = preuve/risque/faux signal', () => {
    expect(GUIDE_ROLE.toto.toLowerCase()).toMatch(/hypothèse|reprise/);
    expect(GUIDE_ROLE.bobo.toLowerCase()).toMatch(/risque|faux signal|preuve/);
  });

  it('aucun rôle ne contient BUY/SELL ni promesse', () => {
    const forbidden = /\b(buy|sell|achet|vend|profit garanti|gain garanti)\b/i;
    for (const role of Object.values(GUIDE_ROLE)) {
      expect(role).not.toMatch(forbidden);
      expect(role.length).toBeGreaterThan(0);
    }
  });

  it('chaque guide a un état de présentation valide', () => {
    expect(GUIDE_PRESENT_STATE.toto).toBe('welcome');
    expect(GUIDE_PRESENT_STATE.bobo).toBe('inspect');
  });
});
