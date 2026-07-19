/**
 * Chart Engine MVP (V5) — logique pure et testable, sans rendu.
 * Étend `interactive.ts` (échelle de prix, niveaux, tolérance) avec :
 *  - le **volume** déterministe dérivé de la géométrie des bougies (aucun hasard) ;
 *  - un **contrôleur de replay** bougie par bougie (machine à états pure).
 * Datasets synthétiques et reproductibles : même série ⇒ même volume, même replay.
 */
import type { Candle } from './types';

// ── Volume ────────────────────────────────────────────────────────────────
/**
 * Volume synthétique d'une bougie : proportionnel à l'amplitude (mèches) et au corps.
 * Déterministe — sert à illustrer la « participation », jamais une donnée de marché réelle.
 */
export function candleVolume(c: Candle): number {
  const range = Math.max(0, c.h - c.l);
  const body = Math.abs(c.c - c.o);
  return Math.round((range * 1.5 + body * 2.5) * 10) / 10;
}

/** Série de volumes alignée sur les bougies (même longueur, même ordre). */
export function volumeSeries(candles: Candle[]): number[] {
  return candles.map(candleVolume);
}

/** Volume maximal d'une série (0 si vide) — pour normaliser les barres. */
export function maxVolume(volumes: number[]): number {
  return volumes.length ? Math.max(...volumes) : 0;
}

// ── Replay bougie par bougie ────────────────────────────────────────────────
export interface ReplayState {
  /** Nombre total de bougies de la série. */
  total: number;
  /** Nombre de bougies actuellement révélées (1..total, ou 0 si série vide). */
  visible: number;
}

/** État initial : `startVisible` bougies révélées, borné à [1, total] (0 si série vide). */
export function initReplay(total: number, startVisible = 1): ReplayState {
  const t = Math.max(0, Math.floor(total));
  if (t === 0) return { total: 0, visible: 0 };
  return { total: t, visible: Math.min(Math.max(1, Math.floor(startVisible)), t) };
}

/** Avance (dir=1) ou recule (dir=-1) d'une bougie, borné à [1, total]. */
export function stepReplay(state: ReplayState, dir: 1 | -1): ReplayState {
  if (state.total === 0) return state;
  const visible = Math.min(state.total, Math.max(1, state.visible + dir));
  return { ...state, visible };
}

/** Révèle toute la série. */
export function revealAll(state: ReplayState): ReplayState {
  return { ...state, visible: state.total };
}

/** Revient à la première bougie (0 si série vide). */
export function resetReplay(state: ReplayState): ReplayState {
  return { ...state, visible: state.total === 0 ? 0 : 1 };
}

/** Toutes les bougies sont-elles révélées ? (vrai aussi pour une série vide.) */
export function replayAtEnd(state: ReplayState): boolean {
  return state.total === 0 || state.visible >= state.total;
}

/** Est-on sur la première bougie (ou série vide) ? */
export function replayAtStart(state: ReplayState): boolean {
  return state.visible <= 1;
}
