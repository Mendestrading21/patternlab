import { describe, it, expect } from '@jest/globals';
import { INDICATOR_LABS, indicatorLabById } from './indicatorLab';
import { datasetByKey } from './visualDatasets';
import { rsi } from './indicatorMath';

describe('indicatorLab — labs paramétrables', () => {
  it('chaque lab a une valeur par défaut valide, un dataset réel et un faux signal', () => {
    for (const lab of INDICATOR_LABS) {
      expect(lab.paramValues.length).toBeGreaterThanOrEqual(2);
      expect(lab.paramValues).toContain(lab.defaultValue);
      expect(datasetByKey(lab.datasetKey).length).toBeGreaterThan(0);
      expect(lab.falseSignal.trim().length).toBeGreaterThan(0);
    }
  });

  it('configFor branche le paramètre choisi et conserve le bon indicateur', () => {
    const rsiLab = indicatorLabById('lab.rsi')!;
    expect(rsiLab.configFor(7).period).toBe(7);
    expect(rsiLab.configFor(21).period).toBe(21);
    expect(rsiLab.configFor(7).kind).toBe('rsi');

    const boll = indicatorLabById('lab.bollinger')!;
    expect(boll.configFor(1.5).k).toBe(1.5);
    expect(boll.configFor(2.5).k).toBe(2.5);

    const ma = indicatorLabById('lab.ma')!;
    expect(ma.configFor(9).slow).toBe(9);
  });

  it('changer le paramètre change réellement la série (RSI 7 ≠ RSI 21)', () => {
    const lab = indicatorLabById('lab.rsi')!;
    const closes = datasetByKey(lab.datasetKey).map((c) => c.c);
    const a = rsi(closes, 7);
    const b = rsi(closes, 21);
    expect(a).not.toEqual(b);
  });

  it('indicatorLabById renvoie undefined pour un id inconnu', () => {
    expect(indicatorLabById('lab.inexistant')).toBeUndefined();
  });
});
