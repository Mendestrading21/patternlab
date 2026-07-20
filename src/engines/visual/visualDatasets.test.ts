import { describe, it, expect } from '@jest/globals';
import { VISUAL_DATASETS, datasetByKey, seriesFromTargets, SUPPORTED_VISUAL_TYPES } from './visualDatasets';
import { V5_CONCEPTS } from '../../data/learningContent';
import { PATTERN_LIBRARY } from '../../data/patternLibrary';
import { FIGURE_OVERLAYS } from './figureOverlays';
import { INDICATOR_CONFIGS } from './indicatorConfigs';

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

  it('les figures de chandeliers ont la bonne géométrie', () => {
    // Marubozu haussier : une seule bougie montante sans mèche.
    const maru = VISUAL_DATASETS['candle.bullish-marubozu.v1'];
    expect(maru).toHaveLength(1);
    expect(maru[0].c).toBeGreaterThan(maru[0].o);
    expect(maru[0].h).toBe(Math.max(maru[0].o, maru[0].c));
    expect(maru[0].l).toBe(Math.min(maru[0].o, maru[0].c));
    // Trois corbeaux : trois bougies toutes baissières et descendantes.
    const crows = VISUAL_DATASETS['candle.three-black-crows.v1'];
    expect(crows).toHaveLength(3);
    expect(crows.every((c) => c.c < c.o)).toBe(true);
    expect(crows[2].c).toBeLessThan(crows[0].c);
    // Trois soldats : trois bougies toutes haussières et montantes.
    const soldiers = VISUAL_DATASETS['candle.three-white-soldiers.v1'];
    expect(soldiers.every((c) => c.c > c.o)).toBe(true);
    expect(soldiers[2].c).toBeGreaterThan(soldiers[0].c);
    // Pincettes hautes : deux bougies au même plus-haut.
    const tw = VISUAL_DATASETS['candle.tweezer-top.v1'];
    expect(tw[0].h).toBe(tw[1].h);
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

describe('intégrité registre ↔ bibliothèque de figures', () => {
  it('chaque glyphe pointe vers un type supporté et un dataset non vide', () => {
    for (const g of PATTERN_LIBRARY) {
      expect(SUPPORTED_VISUAL_TYPES).toContain(g.visualType);
      expect(datasetByKey(g.datasetKey).length).toBeGreaterThan(0);
    }
  });

  it('la famille figure-chartiste est bien fournie', () => {
    const figures = PATTERN_LIBRARY.filter((g) => g.family === 'figure-chartiste');
    expect(figures.length).toBeGreaterThanOrEqual(18);
  });
});

describe('overlays de figures', () => {
  const ids = new Set(PATTERN_LIBRARY.map((g) => g.id));
  it('aucun overlay orphelin (chaque clé correspond à un glyphe)', () => {
    for (const key of Object.keys(FIGURE_OVERLAYS)) {
      expect(ids.has(key)).toBe(true);
    }
  });
  it('les tracés ont des coordonnées finies et un index de bougie dans la série', () => {
    for (const [key, ov] of Object.entries(FIGURE_OVERLAYS)) {
      const glyph = PATTERN_LIBRARY.find((g) => g.id === key)!;
      const n = datasetByKey(glyph.datasetKey).length;
      for (const g of ov.guides ?? []) {
        for (const p of [g.from, g.to]) {
          expect(Number.isFinite(p.i) && Number.isFinite(p.price)).toBe(true);
          expect(p.i).toBeGreaterThanOrEqual(0);
          expect(p.i).toBeLessThanOrEqual(n);
        }
      }
    }
  });
});

describe('configs d’indicateurs', () => {
  const ids = new Set(PATTERN_LIBRARY.map((g) => g.id));
  it('aucune config orpheline et chaque datasetKey résout', () => {
    for (const [key, cfg] of Object.entries(INDICATOR_CONFIGS)) {
      expect(ids.has(key)).toBe(true);
      expect(datasetByKey(cfg.datasetKey).length).toBeGreaterThan(0);
    }
  });
  it('la divergence est cohérente : oscillateur aligné, sommets décroissants, prix croissant', () => {
    const cfg = INDICATOR_CONFIGS['divergence'];
    const candles = datasetByKey(cfg.datasetKey);
    expect(cfg.osc!.length).toBe(candles.length);
    const [pa, pb] = cfg.priceHighs!;
    const [oa, ob] = cfg.oscHighs!;
    expect(candles[pb].h).toBeGreaterThan(candles[pa].h); // prix : plus-haut plus haut
    expect(cfg.osc![ob]).toBeLessThan(cfg.osc![oa]); // oscillateur : plus-haut plus bas
  });
});
