/**
 * Laboratoire — cœur interactif pur et testable.
 * Convertit une coordonnée Y (tap) en prix et inversement (même échelle que le rendu),
 * expose les niveaux cibles (support/résistance) et la tolérance de correction.
 */
import type { Candle } from './types';

export interface PriceScale {
  min: number;
  max: number;
  range: number;
  padY: number;
  height: number;
  yToPrice(y: number): number;
  priceToY(price: number): number;
}

/** Échelle de prix d'un graphique (mèches incluses). */
export function priceScale(candles: Candle[], height: number, padY = 12): PriceScale {
  const values = candles.flatMap((c) => [c.h, c.l]);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const range = max - min || 1;
  const inner = height - 2 * padY;
  return {
    min,
    max,
    range,
    padY,
    height,
    priceToY: (price) => padY + (1 - (price - min) / range) * inner,
    yToPrice: (y) => {
      const clamped = Math.max(padY, Math.min(height - padY, y));
      return min + (1 - (clamped - padY) / inner) * range;
    },
  };
}

/** Support cible : le plancher (plus bas atteint). */
export function supportLevel(candles: Candle[]): number {
  return candles.length ? Math.min(...candles.map((c) => c.l)) : 0;
}

/** Résistance cible : le plafond (plus haut atteint). */
export function resistanceLevel(candles: Candle[]): number {
  return candles.length ? Math.max(...candles.map((c) => c.h)) : 0;
}

/** Le niveau tracé est-il assez proche de la cible (tolérance en fraction de l'amplitude) ? */
export function isLevelClose(userPrice: number, targetPrice: number, range: number, tolPct = 0.06): boolean {
  if (range <= 0) return false;
  return Math.abs(userPrice - targetPrice) <= range * tolPct;
}
