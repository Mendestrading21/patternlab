import { describe, it, expect } from '@jest/globals';
import { generateCandles, mulberry32 } from './demoChart';

describe('demoChart', () => {
  it('est déterministe : même seed ⇒ même série', () => {
    const a = generateCandles(42, 30);
    const b = generateCandles(42, 30);
    expect(a).toEqual(b);
  });

  it('produit des séries différentes pour des seeds différents', () => {
    const a = generateCandles(1, 30);
    const b = generateCandles(2, 30);
    expect(a).not.toEqual(b);
  });

  it('respecte le nombre de bougies et les bornes high/low', () => {
    const candles = generateCandles(7, 25);
    expect(candles).toHaveLength(25);
    for (const c of candles) {
      expect(c.h).toBeGreaterThanOrEqual(Math.max(c.o, c.c));
      expect(c.l).toBeLessThanOrEqual(Math.min(c.o, c.c));
    }
  });

  it('mulberry32 renvoie des valeurs dans [0,1[', () => {
    const rand = mulberry32(123);
    for (let i = 0; i < 100; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
