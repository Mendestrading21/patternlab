/**
 * Séries de prix synthétiques et REPRODUCTIBLES (règle kit : données contrôlées, pas de hasard non maîtrisé).
 * Même seed ⇒ même série, pour des schémas pédagogiques stables et testables.
 */
import type { Candle } from './types';

/** PRNG déterministe. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Génère `count` bougies avec une légère dérive haussière et des replis réalistes. */
export function generateCandles(seed: number, count = 30, drift = 0.35): Candle[] {
  const rand = mulberry32(seed);
  const candles: Candle[] = [];
  let price = 50;
  for (let i = 0; i < count; i++) {
    const open = price;
    const move = (rand() - 0.5) * 8 + drift;
    price = Math.max(8, Math.min(92, price + move));
    const close = price;
    const high = Math.max(open, close) + rand() * 3;
    const low = Math.min(open, close) - rand() * 3;
    candles.push({ o: open, h: high, l: low, c: close });
  }
  return candles;
}
