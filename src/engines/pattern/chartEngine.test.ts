import { describe, it, expect } from '@jest/globals';
import {
  candleVolume,
  volumeSeries,
  maxVolume,
  initReplay,
  stepReplay,
  revealAll,
  resetReplay,
  replayAtEnd,
  replayAtStart,
} from './chartEngine';
import { generateCandles } from './demoChart';
import type { Candle } from './types';

const flat: Candle = { o: 10, h: 10, l: 10, c: 10 };
const wide: Candle = { o: 10, h: 20, l: 5, c: 18 };

describe('volume', () => {
  it('est nul pour une bougie plate, positif pour une bougie ample', () => {
    expect(candleVolume(flat)).toBe(0);
    expect(candleVolume(wide)).toBeGreaterThan(0);
  });

  it('croît avec l’amplitude', () => {
    const small: Candle = { o: 10, h: 11, l: 9, c: 10.5 };
    expect(candleVolume(wide)).toBeGreaterThan(candleVolume(small));
  });

  it('est déterministe (même série ⇒ même volumes)', () => {
    const candles = generateCandles(2024, 20);
    expect(volumeSeries(candles)).toEqual(volumeSeries(candles));
  });

  it('produit une série de même longueur et un max cohérent', () => {
    const candles = generateCandles(7, 12);
    const vols = volumeSeries(candles);
    expect(vols).toHaveLength(candles.length);
    expect(maxVolume(vols)).toBe(Math.max(...vols));
    expect(maxVolume([])).toBe(0);
  });
});

describe('replay', () => {
  it('initialise en bornant [1, total]', () => {
    expect(initReplay(10)).toEqual({ total: 10, visible: 1 });
    expect(initReplay(10, 4)).toEqual({ total: 10, visible: 4 });
    expect(initReplay(10, 99)).toEqual({ total: 10, visible: 10 });
    expect(initReplay(0)).toEqual({ total: 0, visible: 0 });
  });

  it('avance et recule sans sortir de [1, total]', () => {
    let s = initReplay(3);
    s = stepReplay(s, 1);
    expect(s.visible).toBe(2);
    s = stepReplay(s, 1);
    s = stepReplay(s, 1);
    expect(s.visible).toBe(3); // borné en haut
    s = stepReplay(s, -1);
    expect(s.visible).toBe(2);
    s = stepReplay(stepReplay(s, -1), -1);
    expect(s.visible).toBe(1); // borné en bas
  });

  it('revealAll / resetReplay', () => {
    const s = initReplay(5);
    expect(revealAll(s).visible).toBe(5);
    expect(resetReplay(revealAll(s)).visible).toBe(1);
    expect(resetReplay(initReplay(0)).visible).toBe(0);
  });

  it('atStart / atEnd', () => {
    expect(replayAtStart(initReplay(4))).toBe(true);
    expect(replayAtEnd(initReplay(4))).toBe(false);
    expect(replayAtEnd(revealAll(initReplay(4)))).toBe(true);
    expect(replayAtEnd(initReplay(0))).toBe(true);
  });

  it('ne mute pas l’état source (pur)', () => {
    const s = initReplay(3);
    stepReplay(s, 1);
    expect(s.visible).toBe(1);
  });
});
