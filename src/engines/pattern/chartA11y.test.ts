import { describe, it, expect } from '@jest/globals';
import { describeCandles } from './chartA11y';
import { seriesFromTargets } from '../visual/visualDatasets';
import type { Candle } from './types';

describe('describeCandles', () => {
  it('série vide', () => {
    expect(describeCandles([])).toMatch(/aucune donnée/);
  });

  it('décrit une structure haussière', () => {
    const up = seriesFromTargets([40, 44, 48, 52, 56, 60]);
    const s = describeCandles(up);
    expect(s).toMatch(/haussière/);
    expect(s).toMatch(/\d+ bougies/);
  });

  it('décrit une structure baissière', () => {
    const down = seriesFromTargets([60, 56, 52, 48, 44, 40]);
    expect(describeCandles(down)).toMatch(/baissière/);
  });

  it('décrit une structure latérale (première et dernière clôtures proches)', () => {
    // Clôture initiale (52) ≈ clôture finale (52) : variation nette quasi nulle.
    const flat = seriesFromTargets([48, 52, 55, 47, 54, 46, 52]);
    expect(describeCandles(flat)).toMatch(/latérale/);
  });

  it('mentionne les extrêmes bas et haut', () => {
    const c: Candle[] = [{ o: 10, h: 20, l: 5, c: 18 }];
    const s = describeCandles(c);
    expect(s).toMatch(/plus bas 5/);
    expect(s).toMatch(/plus haut 20/);
  });
});
