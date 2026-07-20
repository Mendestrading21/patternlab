/**
 * Profil de volume — logique pure et testable (aucun rendu).
 * Répartit le volume synthétique de chaque bougie (`candleVolume`, dérivé de la géométrie)
 * sur les paliers de prix qu'elle traverse. Déterministe et illustratif : jamais une
 * donnée de marché réelle. Sert au renderer `VolumeProfile` (type visuel `volume-profile`).
 */
import type { Candle } from '../pattern/types';
import { candleVolume } from '../pattern/chartEngine';

export interface VolumeBin {
  /** Index du palier (0 = bas de l'échelle). */
  index: number;
  priceLow: number;
  priceHigh: number;
  priceMid: number;
  volume: number;
  /** Vrai pour le palier de plus fort volume (point de contrôle / POC). */
  isPoc: boolean;
}

export interface VolumeProfile {
  bins: VolumeBin[];
  min: number;
  max: number;
  maxVolume: number;
  /** Index du palier POC (-1 si série vide). */
  pocIndex: number;
}

/** Construit un profil de volume à `bins` paliers (défaut 8). Déterministe. */
export function buildVolumeProfile(candles: Candle[], bins = 8): VolumeProfile {
  const b = Math.max(1, Math.floor(bins));
  if (!candles.length) return { bins: [], min: 0, max: 1, maxVolume: 0, pocIndex: -1 };
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));
  const range = max - min || 1;
  const step = range / b;
  const vols = new Array<number>(b).fill(0);
  for (const c of candles) {
    const v = candleVolume(c);
    const first = Math.max(0, Math.min(b - 1, Math.floor((Math.min(c.l, c.h) - min) / step)));
    const last = Math.max(0, Math.min(b - 1, Math.floor((Math.max(c.l, c.h) - min) / step)));
    const span = last - first + 1;
    for (let k = first; k <= last; k++) vols[k] += v / span;
  }
  const maxVolume = Math.max(...vols);
  const pocIndex = vols.indexOf(maxVolume);
  const out: VolumeBin[] = vols.map((volume, index) => {
    const priceLow = min + index * step;
    const priceHigh = priceLow + step;
    return {
      index,
      priceLow,
      priceHigh,
      priceMid: (priceLow + priceHigh) / 2,
      volume: Math.round(volume * 10) / 10,
      isPoc: index === pocIndex,
    };
  });
  return { bins: out, min, max, maxVolume: Math.round(maxVolume * 10) / 10, pocIndex };
}
