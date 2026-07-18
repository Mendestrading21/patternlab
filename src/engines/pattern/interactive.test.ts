import { describe, it, expect } from '@jest/globals';
import { priceScale, supportLevel, resistanceLevel, isLevelClose } from './interactive';
import type { Candle } from './types';

const candles: Candle[] = [
  { o: 50, h: 60, l: 40, c: 55 },
  { o: 55, h: 58, l: 30, c: 45 }, // plus bas = 30
  { o: 45, h: 70, l: 44, c: 65 }, // plus haut = 70
];

describe('priceScale', () => {
  it('mappe prix↔Y de façon inverse (haut = max, bas = min)', () => {
    const s = priceScale(candles, 170);
    expect(s.min).toBe(30);
    expect(s.max).toBe(70);
    // le prix max est en haut (Y = padY), le min en bas (Y = height - padY)
    expect(s.priceToY(70)).toBeCloseTo(12, 5);
    expect(s.priceToY(30)).toBeCloseTo(170 - 12, 5);
    // aller-retour
    for (const p of [35, 50, 62]) {
      expect(s.yToPrice(s.priceToY(p))).toBeCloseTo(p, 5);
    }
  });

  it('borne Y hors zone au prix min/max', () => {
    const s = priceScale(candles, 170);
    expect(s.yToPrice(-100)).toBeCloseTo(70, 5); // au-dessus → max
    expect(s.yToPrice(9999)).toBeCloseTo(30, 5); // en dessous → min
  });
});

describe('niveaux cibles', () => {
  it('support = plancher, résistance = plafond', () => {
    expect(supportLevel(candles)).toBe(30);
    expect(resistanceLevel(candles)).toBe(70);
  });
});

describe('isLevelClose', () => {
  it('valide dans la tolérance, rejette au-delà', () => {
    const range = 40;
    expect(isLevelClose(30, 30, range)).toBe(true);
    expect(isLevelClose(32, 30, range, 0.06)).toBe(true); // écart 2 ≤ 2.4
    expect(isLevelClose(35, 30, range, 0.06)).toBe(false); // écart 5 > 2.4
    expect(isLevelClose(30, 30, 0)).toBe(false); // amplitude nulle
  });
});
