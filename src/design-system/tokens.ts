/**
 * PatternLab — Design tokens
 * Direction : sombre premium, vert haussier, rouge baissier, or pour les récompenses.
 * Réf. kit : reference/04-design-system.md + planches visuelles 01/05.
 *
 * IMPORTANT (règle kit) : distinguer la sémantique PÉDAGOGIQUE (correct/incorrect)
 * de la sémantique FINANCIÈRE (bullish/bearish). Dans un exercice de marché, une
 * bougie verte n'est PAS « la bonne réponse ». Les tokens `feedback*` sont donc
 * séparés de `bullish/bearish` pour permettre aux exercices de patterns de les surcharger.
 */

export const palette = {
  bg: '#0C1411',
  surface: '#14201B',
  surfaceElevated: '#1C2C25',
  surfaceSunken: '#0A100D',
  border: '#26362E',
  borderStrong: '#33473C',

  textPrimary: '#F1F5F2',
  textSecondary: '#9DB0A6',
  textMuted: '#6B7D74',

  green: '#2FB35C',
  greenBright: '#3FD07A',
  greenDim: '#1E7A3E',
  red: '#D0453C',
  redBright: '#E15A50',
  amber: '#E6A23C',
  blue: '#3E9AE6',
  gold: '#E9B44C',

  white: '#FFFFFF',
  black: '#000000',
  onGreen: '#06210F',
  onGold: '#2A1E05',
} as const;

export const colors = {
  background: palette.bg,
  surface: palette.surface,
  surfaceElevated: palette.surfaceElevated,
  surfaceSunken: palette.surfaceSunken,
  border: palette.border,
  borderStrong: palette.borderStrong,

  textPrimary: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textMuted: palette.textMuted,

  // UI semantics
  primary: palette.green,
  primaryBright: palette.greenBright,
  success: palette.green,
  danger: palette.red,
  warning: palette.amber,
  info: palette.blue,
  reward: palette.gold,
  neutral: palette.textMuted,

  // Financial semantics (chart direction) — NOT to be reused as correct/incorrect
  bullish: palette.green,
  bearish: palette.red,

  // Pedagogical feedback — intentionally distinct from bullish/bearish
  feedbackCorrect: palette.green,
  feedbackIncorrect: palette.red,

  onPrimary: palette.onGreen,
  onReward: palette.onGold,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export type FontWeight = '400' | '500' | '600' | '700' | '800';

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' as FontWeight, letterSpacing: -0.5 },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '700' as FontWeight, letterSpacing: -0.3 },
  h2: { fontSize: 21, lineHeight: 27, fontWeight: '700' as FontWeight },
  title: { fontSize: 17, lineHeight: 23, fontWeight: '600' as FontWeight },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as FontWeight },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '600' as FontWeight, letterSpacing: 0.2 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as FontWeight },
} as const;

export type TypographyVariant = keyof typeof typography;
