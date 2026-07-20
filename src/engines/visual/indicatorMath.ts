/**
 * Indicateurs techniques — calculs PURS et déterministes à partir d'une série OHLC (Lot 4).
 * Aucune donnée réelle, aucun hasard. Sert au renderer `IndicatorPanel`.
 * Objectif pédagogique : illustrer la lecture d'un indicateur, jamais produire un signal.
 */
import type { Candle } from '../pattern/types';

export const closesOf = (candles: Candle[]): number[] => candles.map((c) => c.c);

/** Moyenne mobile simple (période p). Renvoie `null` avant d'avoir assez de points. */
export function sma(values: number[], p: number): (number | null)[] {
  const out: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < p - 1) {
      out.push(null);
      continue;
    }
    let s = 0;
    for (let j = i - p + 1; j <= i; j++) s += values[j];
    out.push(s / p);
  }
  return out;
}

/** Moyenne mobile exponentielle (période p), amorcée par la SMA initiale. */
export function ema(values: number[], p: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (values.length < p) return out;
  const k = 2 / (p + 1);
  let prev = values.slice(0, p).reduce((a, b) => a + b, 0) / p;
  out[p - 1] = prev;
  for (let i = p; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

/** RSI de Wilder (période p). Renvoie des valeurs 0–100 (ou `null` au début). */
export function rsi(closes: number[], p: number): (number | null)[] {
  const out: (number | null)[] = Array(closes.length).fill(null);
  if (closes.length <= p) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= p; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgG = gain / p;
  let avgL = loss / p;
  out[p] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  for (let i = p + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    const g = d >= 0 ? d : 0;
    const l = d < 0 ? -d : 0;
    avgG = (avgG * (p - 1) + g) / p;
    avgL = (avgL * (p - 1) + l) / p;
    out[i] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  }
  return out;
}

export interface MacdPoint {
  macd: number | null;
  signal: number | null;
  hist: number | null;
}
/** MACD (rapide/lent/signal). hist = macd − signal. */
export function macdSeries(closes: number[], fast = 12, slow = 26, signalP = 9): MacdPoint[] {
  const eFast = ema(closes, fast);
  const eSlow = ema(closes, slow);
  const macdLine = closes.map((_, i) =>
    eFast[i] != null && eSlow[i] != null ? (eFast[i] as number) - (eSlow[i] as number) : null,
  );
  // Ligne de signal : EMA du MACD sur les points définis.
  const defined = macdLine.map((v) => v ?? 0);
  const sig = ema(defined, signalP);
  return macdLine.map((m, i) => {
    const s = m != null ? sig[i] : null;
    return { macd: m, signal: s, hist: m != null && s != null ? m - s : null };
  });
}

export interface Band {
  mid: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
}
/** Bandes de Bollinger : SMA(p) ± k · écart-type(p). */
export function bollinger(closes: number[], p = 20, k = 2): Band {
  const mid = sma(closes, p);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    const m = mid[i];
    if (m == null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    let sq = 0;
    for (let j = i - p + 1; j <= i; j++) sq += (closes[j] - m) ** 2;
    const sd = Math.sqrt(sq / p);
    upper.push(m + k * sd);
    lower.push(m - k * sd);
  }
  return { mid, upper, lower };
}

export interface FibLevel {
  ratio: number;
  price: number;
}
/** Niveaux de retracement de Fibonacci entre un plus-bas et un plus-haut. */
export function fibLevels(low: number, high: number): FibLevel[] {
  const ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  return ratios.map((r) => ({ ratio: r, price: high - (high - low) * r }));
}

/** Volume pédagogique déterministe : dérivé de l'amplitude et du corps de chaque bougie. */
export function volumeBars(candles: Candle[]): number[] {
  return candles.map((c) => Math.round((c.h - c.l) * 8 + Math.abs(c.c - c.o) * 12 + 20));
}
