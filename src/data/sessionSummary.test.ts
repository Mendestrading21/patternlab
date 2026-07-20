import { describe, it, expect } from '@jest/globals';
import { buildSessionSummary } from './sessionSummary';

describe('buildSessionSummary', () => {
  it('sans faute → palier parfait', () => {
    const s = buildSessionSummary(5, 5);
    expect(s.tier).toBe('perfect');
    expect(s.passed).toBe(true);
    expect(s.accuracyPct).toBe(100);
    expect(s.emoji).toBe('🏆');
  });

  it('au-dessus du seuil (0.7) mais pas parfait → réussi', () => {
    const s = buildSessionSummary(4, 5); // 80 %
    expect(s.tier).toBe('pass');
    expect(s.passed).toBe(true);
    expect(s.accuracyPct).toBe(80);
  });

  it('sous le seuil → à retenter', () => {
    const s = buildSessionSummary(3, 5); // 60 % < 70 %
    expect(s.tier).toBe('retry');
    expect(s.passed).toBe(false);
    expect(s.emoji).toBe('💪');
  });

  it('borne et assainit les entrées', () => {
    expect(buildSessionSummary(9, 5).correct).toBe(5); // correct ≤ total
    expect(buildSessionSummary(-2, 5).correct).toBe(0);
    const empty = buildSessionSummary(0, 0);
    expect(empty.accuracy).toBe(0);
    expect(empty.tier).toBe('retry');
    expect(buildSessionSummary(3, Number.NaN).total).toBe(0);
  });

  it('respecte un passRatio personnalisé', () => {
    expect(buildSessionSummary(3, 5, 0.5).tier).toBe('pass'); // 60 % ≥ 50 %
  });
});
