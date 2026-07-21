import { describe, it, expect } from '@jest/globals';
import { candleLayout, type Box } from './candleGeometry';
import { priceScale } from '../pattern/interactive';
import type { Candle } from '../pattern/types';

const box: Box = { width: 300, height: 160, padY: 14 };
const H = box.height;
const finite = (n: number) => Number.isFinite(n);

/** Le graphique canonique doit rester robuste sur les jeux de données limites (Lot 5). */
describe('robustesse du graphique — datasets vide / plat / extrême', () => {
  it('vide : aucune erreur, échelle bornée, aucune bougie', () => {
    const scale = priceScale([], H, 14);
    expect(finite(scale.min) && finite(scale.max) && finite(scale.range)).toBe(true);
    expect(scale.range).toBeGreaterThan(0);
    expect(candleLayout([], box)).toEqual([]);
  });

  it('plat : prix constants → pas de division par zéro, Y borné', () => {
    const flat: Candle[] = Array.from({ length: 6 }, () => ({ o: 100, h: 100, l: 100, c: 100 }));
    const scale = priceScale(flat, H, 14);
    expect(scale.range).toBeGreaterThan(0); // range || 1 protège la division
    for (const p of [scale.min, scale.max]) {
      const y = scale.priceToY(p);
      expect(finite(y)).toBe(true);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(H);
    }
    const layout = candleLayout(flat, box);
    expect(layout).toHaveLength(6);
    for (const c of layout) {
      expect(finite(c.bodyY) && finite(c.bodyH) && finite(c.wickTop) && finite(c.wickBottom)).toBe(true);
      expect(c.bodyH).toBeGreaterThanOrEqual(1.5); // corps visible même si O=C
      expect(c.bodyW).toBeGreaterThanOrEqual(2);
    }
  });

  it('extrême : amplitude énorme → coordonnées finies et dans la boîte', () => {
    const extreme: Candle[] = [
      { o: 0.0001, h: 1_000_000_000, l: 0.00001, c: 5 },
      { o: 5, h: 10, l: 0.001, c: 999_999 },
    ];
    const scale = priceScale(extreme, H, 14);
    expect(finite(scale.range)).toBe(true);
    const layout = candleLayout(extreme, box);
    for (const c of layout) {
      for (const y of [c.bodyY, c.wickTop, c.wickBottom]) {
        expect(finite(y)).toBe(true);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(H);
      }
      expect(finite(c.bodyH)).toBe(true);
      expect(c.bodyH).toBeGreaterThanOrEqual(1.5);
    }
  });

  it('yToPrice reste dans [min, max] même hors bornes', () => {
    const scale = priceScale([{ o: 10, h: 20, l: 5, c: 15 }], H, 14);
    for (const y of [-100, 0, H / 2, H, H + 100]) {
      const p = scale.yToPrice(y);
      expect(p).toBeGreaterThanOrEqual(scale.min - 1e-6);
      expect(p).toBeLessThanOrEqual(scale.max + 1e-6);
    }
  });
});
