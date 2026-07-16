/**
 * Moteur de patterns — reconnaissance/analyse, pas une encyclopédie statique.
 * Conforme à schemas/pattern.schema.json. Extensible vers 500+ sans changer le cœur.
 */
import type { ContentStatus, LegacyMeta } from '../learning/types';

export type PatternDirection = 'bullish' | 'bearish' | 'neutral' | 'contextual';

export type PatternFamily =
  | 'candlestick'
  | 'support_resistance'
  | 'trend'
  | 'triangle'
  | 'flag_pennant'
  | 'double_top_bottom'
  | 'head_shoulders'
  | 'wedge'
  | 'channel'
  | 'gap'
  | 'breakout'
  | 'divergence';

export interface Pattern {
  id: string;
  slug: string;
  name: string;
  aliases?: string[];
  family: PatternFamily;
  direction?: PatternDirection;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  definition?: string;
  recognitionRules: string[];
  invalidationRules: string[];
  commonMistakes?: string[];
  confirmationSignals?: string[];
  examples?: unknown[];
  sources?: string[];
  status: ContentStatus;
  legacy?: LegacyMeta;
}

/** Bougie japonaise (open/high/low/close). */
export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}
