/**
 * Géométrie de bougies — pure et testable (aucun rendu). Convertit des `Candle` en
 * coordonnées SVG dans une boîte logique. Réutilise `priceScale` du moteur pattern
 * (même échelle que `PatternChart`/`InteractiveChart`).
 */
import { priceScale } from '../pattern/interactive';
import type { Candle } from '../pattern/types';

export interface Box {
  width: number;
  height: number;
  padY?: number;
}

export interface CandleRender {
  index: number;
  up: boolean;
  wickX: number;
  wickTop: number;
  wickBottom: number;
  bodyX: number;
  bodyY: number;
  bodyW: number;
  bodyH: number;
}

/** Dispose une série de bougies dans la boîte (corps + mèches). */
export function candleLayout(candles: Candle[], box: Box): CandleRender[] {
  const { width, height, padY = 12 } = box;
  const scale = priceScale(candles, height, padY);
  const n = candles.length || 1;
  const slot = width / n;
  const bodyW = Math.max(2, slot * 0.6);
  return candles.map((c, i) => {
    const cx = i * slot + slot / 2;
    const up = c.c >= c.o;
    const bodyTop = scale.priceToY(Math.max(c.o, c.c));
    const bodyBottom = scale.priceToY(Math.min(c.o, c.c));
    return {
      index: i,
      up,
      wickX: cx,
      wickTop: scale.priceToY(c.h),
      wickBottom: scale.priceToY(c.l),
      bodyX: cx - bodyW / 2,
      bodyY: bodyTop,
      bodyW,
      bodyH: Math.max(1.5, bodyBottom - bodyTop),
    };
  });
}

export interface Pt {
  x: number;
  y: number;
}
export interface AnatomyLayout {
  up: boolean;
  body: { x: number; y: number; w: number; h: number };
  upperWick: { x: number; y1: number; y2: number };
  lowerWick: { x: number; y1: number; y2: number };
  points: { open: Pt; high: Pt; low: Pt; close: Pt };
}

/** Dispose UNE bougie en grand, avec ancres labellisables (corps, mèches, O/H/L/C). */
export function candleAnatomyParts(candle: Candle, box: Box): AnatomyLayout {
  const { width, height, padY = 26 } = box;
  const scale = priceScale([candle], height, padY);
  const cx = width * 0.42;
  const bodyW = Math.max(16, width * 0.14);
  const up = candle.c >= candle.o;
  const bodyTop = scale.priceToY(Math.max(candle.o, candle.c));
  const bodyBottom = scale.priceToY(Math.min(candle.o, candle.c));
  return {
    up,
    body: { x: cx - bodyW / 2, y: bodyTop, w: bodyW, h: Math.max(2, bodyBottom - bodyTop) },
    upperWick: { x: cx, y1: scale.priceToY(candle.h), y2: bodyTop },
    lowerWick: { x: cx, y1: bodyBottom, y2: scale.priceToY(candle.l) },
    points: {
      open: { x: cx, y: scale.priceToY(candle.o) },
      high: { x: cx, y: scale.priceToY(candle.h) },
      low: { x: cx, y: scale.priceToY(candle.l) },
      close: { x: cx, y: scale.priceToY(candle.c) },
    },
  };
}
