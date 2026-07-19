import { describe, it, expect } from '@jest/globals';
import { A11Y, isHeadingVariant, hitSlopFor, decorative, HEADING_VARIANTS } from './a11y';

describe('jetons a11y', () => {
  it('cible tactile minimale ≥ 44', () => {
    expect(A11Y.minTouchTarget).toBeGreaterThanOrEqual(44);
  });
  it('plafond de mise à l’échelle des polices honore le dynamic type (> 1)', () => {
    expect(A11Y.maxFontScale).toBeGreaterThan(1);
  });
});

describe('isHeadingVariant', () => {
  it('seul h1 est un titre (une occurrence par écran)', () => {
    expect(HEADING_VARIANTS).toEqual(['h1']);
    expect(isHeadingVariant('h1')).toBe(true);
  });
  it('les variantes surchargées ne sont pas des titres (display/h2/nombres/emojis)', () => {
    for (const v of ['display', 'h2', 'body', 'title', 'label', 'caption'] as const) {
      expect(isHeadingVariant(v)).toBe(false);
    }
  });
});

describe('hitSlopFor', () => {
  it('agrandit une petite cible jusqu’au minimum', () => {
    expect(hitSlopFor(24)).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });
  it('ne rembourre pas une cible déjà assez grande', () => {
    expect(hitSlopFor(48)).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });
});

describe('decorative', () => {
  it('masque l’élément aux technologies d’assistance', () => {
    expect(decorative.accessibilityElementsHidden).toBe(true);
    expect(decorative.importantForAccessibility).toBe('no-hide-descendants');
  });
});
