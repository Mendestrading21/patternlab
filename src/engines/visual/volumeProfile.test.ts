import { describe, it, expect } from '@jest/globals';
import { buildVolumeProfile } from './volumeProfile';
import { datasetByKey } from './visualDatasets';

describe('buildVolumeProfile', () => {
  const candles = datasetByKey('structure.support-resistance.v1');

  it('produit le nombre de paliers demandé', () => {
    expect(buildVolumeProfile(candles, 8).bins).toHaveLength(8);
    expect(buildVolumeProfile(candles, 5).bins).toHaveLength(5);
    expect(buildVolumeProfile(candles, 0).bins).toHaveLength(1); // borné à >= 1
  });

  it('est déterministe', () => {
    expect(buildVolumeProfile(candles, 8)).toEqual(buildVolumeProfile(candles, 8));
  });

  it('désigne exactement un POC, au volume maximal', () => {
    const p = buildVolumeProfile(candles, 8);
    expect(p.bins.filter((b) => b.isPoc)).toHaveLength(1);
    expect(p.pocIndex).toBeGreaterThanOrEqual(0);
    expect(p.bins[p.pocIndex].volume).toBe(Math.max(...p.bins.map((b) => b.volume)));
    expect(p.maxVolume).toBeGreaterThan(0);
  });

  it('paliers ordonnés par prix croissant et dans l’amplitude', () => {
    const p = buildVolumeProfile(candles, 8);
    for (let i = 1; i < p.bins.length; i++) {
      expect(p.bins[i].priceMid).toBeGreaterThan(p.bins[i - 1].priceMid);
    }
    expect(p.bins[0].priceLow).toBeCloseTo(p.min, 5);
    expect(p.bins[p.bins.length - 1].priceHigh).toBeCloseTo(p.max, 5);
  });

  it('série vide → profil vide sûr', () => {
    const p = buildVolumeProfile([], 8);
    expect(p.bins).toEqual([]);
    expect(p.pocIndex).toBe(-1);
    expect(p.maxVolume).toBe(0);
  });
});
