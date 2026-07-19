import { describe, it, expect } from '@jest/globals';
import { VISUAL_DATASETS, datasetByKey, seriesFromTargets, SUPPORTED_VISUAL_TYPES } from './visualDatasets';
import { V5_CONCEPTS } from '../../data/learningContent';

describe('datasets déterministes', () => {
  it('seriesFromTargets chaîne open→close et est déterministe', () => {
    const s = seriesFromTargets([50, 55, 52]);
    expect(s).toHaveLength(2);
    expect(s[0].o).toBe(50);
    expect(s[0].c).toBe(55);
    expect(s[1].o).toBe(55); // ouvre au close précédent
    expect(seriesFromTargets([50, 55, 52])).toEqual(s);
  });

  it('chaque dataset est non vide', () => {
    for (const [key, candles] of Object.entries(VISUAL_DATASETS)) {
      expect(candles.length).toBeGreaterThan(0);
      expect(datasetByKey(key)).toBe(candles);
    }
  });

  it('le double creux présente bien deux planchers proches', () => {
    const w = VISUAL_DATASETS['pattern.double-bottom.v1'];
    const min = Math.min(...w.map((c) => c.l));
    const lows = w.filter((c) => c.l <= min + 1.5);
    expect(lows.length).toBeGreaterThanOrEqual(2);
  });

  it('datasetByKey renvoie [] pour une clé inconnue', () => {
    expect(datasetByKey('nope')).toEqual([]);
    expect(datasetByKey(undefined)).toEqual([]);
  });
});

describe('intégrité registre ↔ concepts amorce', () => {
  it('chaque VisualSpec des concepts amorce est rendu (type supporté + dataset présent + résumé)', () => {
    for (const c of V5_CONCEPTS) {
      const spec = c.visualSpec;
      if (!spec) continue;
      expect(SUPPORTED_VISUAL_TYPES).toContain(spec.type);
      expect(spec.accessibilitySummary.trim().length).toBeGreaterThan(0);
      if (spec.datasetKey) {
        expect(datasetByKey(spec.datasetKey).length).toBeGreaterThan(0);
      }
    }
  });
});
