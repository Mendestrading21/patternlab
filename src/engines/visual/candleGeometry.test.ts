import { describe, it, expect } from '@jest/globals';
import { candleLayout, candleAnatomyParts, type Box } from './candleGeometry';
import type { Candle } from '../pattern/types';

const box: Box = { width: 320, height: 180, padY: 12 };

describe('candleLayout', () => {
  const candles: Candle[] = [
    { o: 50, h: 55, l: 45, c: 53 },
    { o: 53, h: 54, l: 48, c: 49 },
  ];
  const layout = candleLayout(candles, box);

  it('produit une entrée par bougie, dans la boîte', () => {
    expect(layout).toHaveLength(2);
    for (const c of layout) {
      expect(c.bodyY).toBeGreaterThanOrEqual(box.padY! - 0.01);
      expect(c.bodyY + c.bodyH).toBeLessThanOrEqual(box.height - box.padY! + 0.01);
      expect(c.bodyW).toBeGreaterThan(0);
      expect(c.wickTop).toBeLessThanOrEqual(c.wickBottom); // haut = plus petit Y
    }
  });

  it('oriente les bougies (haussière/baissière)', () => {
    expect(layout[0].up).toBe(true); // 53 ≥ 50
    expect(layout[1].up).toBe(false); // 49 < 53
  });

  it('est déterministe', () => {
    expect(candleLayout(candles, box)).toEqual(layout);
  });
});

describe('candleAnatomyParts', () => {
  const a = candleAnatomyParts({ o: 46, h: 56, l: 42, c: 52 }, { width: 320, height: 200, padY: 26 });

  it('place le plus haut au-dessus du corps et le plus bas en dessous', () => {
    expect(a.points.high.y).toBeLessThan(a.body.y); // Y plus petit = plus haut
    expect(a.points.low.y).toBeGreaterThan(a.body.y + a.body.h);
    expect(a.up).toBe(true);
  });

  it('ordonne correctement les mèches', () => {
    expect(a.upperWick.y1).toBeLessThan(a.upperWick.y2); // du haut vers le corps
    expect(a.lowerWick.y1).toBeLessThan(a.lowerWick.y2); // du corps vers le bas
  });
});
