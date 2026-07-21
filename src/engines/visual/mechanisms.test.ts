import { describe, it, expect } from '@jest/globals';
import { MECHANISMS, mechanism } from './mechanisms';

describe('mechanisms — schémas économie/mécanisme', () => {
  it('dividende et per sont définis avec des étapes et une note', () => {
    for (const key of ['dividende', 'per']) {
      const m = mechanism(key);
      expect(m).toBeDefined();
      expect(m!.steps.length).toBeGreaterThanOrEqual(2);
      expect(m!.steps.every((s) => s.label.trim().length > 0)).toBe(true);
      expect((m!.note ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  it('un variant inconnu renvoie undefined', () => {
    expect(mechanism('inexistant')).toBeUndefined();
  });

  it('toutes les entrées du registre ont au moins deux étapes', () => {
    for (const m of Object.values(MECHANISMS)) {
      expect(m.steps.length).toBeGreaterThanOrEqual(2);
    }
  });
});
