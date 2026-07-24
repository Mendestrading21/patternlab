import { describe, it, expect } from '@jest/globals';
import { motionPlan, popScale, loopsFloat } from './motionPlan';
import { CHARACTER_STATES } from './states';
import type { CharacterState } from './types';

const ALL = Object.keys(CHARACTER_STATES) as CharacterState[];

describe('motionPlan — noyau pur de mouvement', () => {
  it('reduced-motion → statique pour TOUS les états (aucun mouvement)', () => {
    for (const s of ALL) {
      expect(motionPlan(s, true)).toEqual({ kind: 'static' });
    }
  });

  it('sans reduced-motion → plan animé avec pop dosé par l’intensité', () => {
    const plan = motionPlan('celebrate-small', false); // intensité « lively »
    expect(plan.kind).toBe('animated');
    if (plan.kind === 'animated') expect(plan.popScale).toBe(1.14);
  });

  it('pop : lively > subtle > still, et still = 1.0 (aucun agrandissement système)', () => {
    expect(popScale('lively')).toBeGreaterThan(popScale('subtle'));
    expect(popScale('subtle')).toBeGreaterThan(popScale('still'));
    expect(popScale('still')).toBe(1.0);
  });

  it('SEUL idle entretient une boucle (flottement) — aucune boucle décorative ailleurs', () => {
    const looping = ALL.filter((s) => loopsFloat(s));
    expect(looping).toEqual(['idle']);
    // Corollaire : au démontage, au plus UNE boucle (idle) est à annuler — pas de timer orphelin ailleurs.
    for (const s of ALL) {
      const plan = motionPlan(s, false);
      if (s !== 'idle' && plan.kind === 'animated') expect(plan.loopFloat).toBe(false);
    }
  });

  it('un état système « still » ne grossit pas même animé (offline, loading, rest)', () => {
    for (const s of ['offline', 'loading', 'rest'] as const) {
      const plan = motionPlan(s, false);
      if (plan.kind === 'animated') expect(plan.popScale).toBe(1.0);
    }
  });
});
