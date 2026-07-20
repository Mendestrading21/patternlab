import { describe, it, expect } from '@jest/globals';
import {
  PRICING,
  PREMIUM_FEATURES,
  planById,
  isPremium,
  activate,
  deactivate,
  emptyPremium,
  migratePremium,
} from './premium';

describe('offres', () => {
  it('expose les trois formules hypothétiques avec des ids uniques', () => {
    const ids = PRICING.map((p) => p.id);
    expect(new Set(ids)).toEqual(new Set(['founder', 'monthly', 'annual']));
    expect(PRICING.every((p) => p.price > 0 && p.period.length > 0)).toBe(true);
  });

  it('planById retrouve une offre ou undefined', () => {
    expect(planById('founder')?.label).toBe('Pass Fondateur');
    expect(planById(null)).toBeUndefined();
  });

  it('liste des fonctionnalités premium non vide et étiquetée', () => {
    expect(PREMIUM_FEATURES.length).toBeGreaterThan(0);
    expect(PREMIUM_FEATURES.every((f) => f.label.length > 0 && f.icon.length > 0)).toBe(true);
  });
});

describe('entitlement', () => {
  it('un état vide n’est pas premium', () => {
    expect(isPremium(emptyPremium())).toBe(false);
    expect(isPremium(null)).toBe(false);
  });

  it('activate rend premium, marque le plan, la date et reste une démo', () => {
    const p = activate('annual', '2026-07-18T10:00:00.000Z');
    expect(isPremium(p)).toBe(true);
    expect(p.plan).toBe('annual');
    expect(p.since).toBe('2026-07-18T10:00:00.000Z');
    expect(p.demo).toBe(true); // jamais un achat réel
  });

  it('deactivate revient à l’état gratuit', () => {
    expect(isPremium(deactivate())).toBe(false);
  });
});

describe('migratePremium', () => {
  it('rejette un plan inconnu et incohérent (actif sans plan)', () => {
    expect(migratePremium({ active: true, plan: 'diamond' })).toEqual(emptyPremium());
    expect(migratePremium({ active: true, plan: null })).toEqual(emptyPremium());
    expect(migratePremium(null)).toEqual(emptyPremium());
    expect(migratePremium('nope')).toEqual(emptyPremium());
  });

  it('conserve un état actif valide et force demo=true', () => {
    const m = migratePremium({ active: true, plan: 'founder', since: '2026-07-01T00:00:00.000Z', demo: false });
    expect(m).toEqual({ active: true, plan: 'founder', since: '2026-07-01T00:00:00.000Z', demo: true });
  });
});
