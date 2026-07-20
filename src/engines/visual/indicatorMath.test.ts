import { describe, it, expect } from '@jest/globals';
import { sma, ema, rsi, macdSeries, bollinger, fibLevels, volumeBars, closesOf } from './indicatorMath';
import { seriesFromTargets } from './visualDatasets';

describe('indicatorMath (pur, déterministe)', () => {
  it('sma : null avant la période, moyenne ensuite', () => {
    const s = sma([2, 4, 6, 8], 2);
    expect(s[0]).toBeNull();
    expect(s[1]).toBe(3);
    expect(s[2]).toBe(5);
    expect(s[3]).toBe(7);
  });

  it('sma est déterministe', () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toEqual(sma([1, 2, 3, 4, 5], 3));
  });

  it('ema amorce à la SMA puis suit le prix', () => {
    const e = ema([1, 2, 3, 4, 5, 6], 3);
    expect(e[0]).toBeNull();
    expect(e[1]).toBeNull();
    expect(e[2]).toBe(2); // SMA(1,2,3)
    expect(e[5]).toBeGreaterThan(e[2] as number);
  });

  it('rsi reste borné 0–100 et monte en tendance haussière', () => {
    const closes = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    const r = rsi(closes, 3);
    const defined = r.filter((v): v is number => v != null);
    expect(defined.length).toBeGreaterThan(0);
    for (const v of defined) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
    expect(defined[defined.length - 1]).toBeGreaterThan(70); // hausse continue → suracheté
  });

  it('macd : hist = macd − signal quand définis', () => {
    const closes = seriesFromTargets([40, 44, 42, 48, 46, 52, 50, 56, 54, 60, 58, 64, 62, 68, 66, 72, 70, 76, 74, 80, 78, 84, 82, 88, 86, 92, 90, 96]).map((c) => c.c);
    const m = macdSeries(closes, 3, 6, 4);
    const pt = m.find((x) => x.macd != null && x.signal != null)!;
    expect(pt.hist).toBeCloseTo((pt.macd as number) - (pt.signal as number), 6);
  });

  it('bollinger : upper ≥ mid ≥ lower', () => {
    const closes = seriesFromTargets([50, 54, 48, 56, 46, 58, 50, 44, 60, 52]).map((c) => c.c);
    const b = bollinger(closes, 3, 2);
    for (let i = 0; i < closes.length; i++) {
      if (b.mid[i] == null) continue;
      expect(b.upper[i] as number).toBeGreaterThanOrEqual(b.mid[i] as number);
      expect(b.mid[i] as number).toBeGreaterThanOrEqual(b.lower[i] as number);
    }
  });

  it('fibLevels : 7 niveaux ordonnés du haut (ratio 0) au bas (ratio 1)', () => {
    const f = fibLevels(40, 60);
    expect(f).toHaveLength(7);
    expect(f[0]).toEqual({ ratio: 0, price: 60 });
    expect(f[6]).toEqual({ ratio: 1, price: 40 });
    expect(f[3].price).toBe(50); // 50 %
  });

  it('volumeBars : positif et déterministe', () => {
    const candles = seriesFromTargets([50, 55, 52, 58]);
    const v = volumeBars(candles);
    expect(v.every((x) => x > 0)).toBe(true);
    expect(volumeBars(candles)).toEqual(v);
    expect(closesOf(candles)).toEqual(candles.map((c) => c.c));
  });
});
