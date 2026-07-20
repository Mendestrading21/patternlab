/**
 * PatternLab — Design tokens (V2 « Instrument Glass »).
 * Direction : surfaces mates graphite/bleu nuit, verre sombre contrôlé, couleur
 * fonctionnelle parcimonieuse (≈ 70 / 20 / 10). Réf. skill : patternlab-product-growth
 * « Direction visuelle » + reference/04-design-system.md.
 *
 * IMPORTANT (règle kit) : distinguer la sémantique PÉDAGOGIQUE (correct/incorrect)
 * de la sémantique FINANCIÈRE (bullish/bearish). Dans un exercice de marché, une
 * bougie verte n'est PAS « la bonne réponse ». Les tokens `feedback*` sont donc
 * séparés de `bullish/bearish` pour permettre aux exercices de patterns de les surcharger.
 *
 * Accessibilité : les paires texte/surface visent le contraste WCAG AA (≥ 4.5).
 * Vérifié par `contrast.test.ts` — ne pas assombrir `textMuted` sans revalider.
 */

export const palette = {
  // Surfaces mates (bleu nuit / graphite) — V5 : fond profond aligné #070B11
  backgroundDeep: '#070B11',
  bg: '#0B1119',
  surface: '#111A24',
  surfaceElevated: '#172331',
  surfaceInteractive: '#1C2A39',
  surfaceSunken: '#080C12',

  // Bordures / verre contrôlé
  borderSubtle: '#253343',
  borderStrong: '#364A60',
  hairline: 'rgba(244, 247, 250, 0.06)',
  // Verre sombre contrôlé (≈ 20 % de l'identité V5) : voile translucide + liseré clair.
  glass: 'rgba(23, 35, 49, 0.72)',
  glassBorder: 'rgba(244, 247, 250, 0.12)',

  // Texte (textMuted éclairci vs la palette indicative pour tenir l'AA sur surfaces élevées)
  textPrimary: '#F4F7FA',
  textSecondary: '#AAB7C6',
  textMuted: '#8B99AB',

  // Couleur fonctionnelle
  green: '#26C281',
  greenBright: '#3BD695',
  greenDim: '#1C8F5E',
  red: '#F05A67',
  redBright: '#F5727D',
  technical: '#42B7E8',
  amber: '#F3B94E',
  gold: '#E8B94F',
  neutral: '#8292A6',
  // Concepts avancés (V5) : violet distinct des sémantiques financière/pédagogique.
  advanced: '#9B7CF6',

  white: '#FFFFFF',
  black: '#000000',
  onGreen: '#06210F',
  onGold: '#2A1E05',
  onAdvanced: '#1A1030',
} as const;

export const colors = {
  background: palette.bg,
  backgroundDeep: palette.backgroundDeep,
  surface: palette.surface,
  surfaceElevated: palette.surfaceElevated,
  surfaceInteractive: palette.surfaceInteractive,
  surfaceSunken: palette.surfaceSunken,
  border: palette.borderSubtle,
  borderSubtle: palette.borderSubtle,
  borderStrong: palette.borderStrong,
  hairline: palette.hairline,
  glass: palette.glass,
  glassBorder: palette.glassBorder,

  textPrimary: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textMuted: palette.textMuted,

  // UI semantics
  primary: palette.green,
  primaryBright: palette.greenBright,
  primaryDim: palette.greenDim,
  success: palette.green,
  danger: palette.red,
  warning: palette.amber,
  info: palette.technical,
  technical: palette.technical,
  reward: palette.gold,
  neutral: palette.neutral,
  /** Concepts avancés (difficulté 4–5, familles expertes) — jamais une direction financière. */
  advanced: palette.advanced,

  // Financial semantics (chart direction) — NOT to be reused as correct/incorrect
  bullish: palette.green,
  bearish: palette.red,

  // Pedagogical feedback — intentionally distinct from bullish/bearish
  feedbackCorrect: palette.green,
  feedbackIncorrect: palette.red,

  onPrimary: palette.onGreen,
  onReward: palette.onGold,
  onAdvanced: palette.onAdvanced,
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

/** Ombres portées (profondeur « verre » discrète, contrôlée). Compatibles iOS/Android/web. */
export const elevation = {
  none: {},
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  raised: {
    shadowColor: '#000000',
    shadowOpacity: 0.42,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
} as const;

export type Elevation = keyof typeof elevation;

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
