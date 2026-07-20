/**
 * Accessibilité — jetons et aides pures, réutilisables (skill : lecteurs d'écran,
 * clavier web, cibles tactiles, polices dynamiques, alternatives aux gestes).
 */
import type { AccessibilityProps } from 'react-native';
import type { TypographyVariant } from './tokens';

export const A11Y = {
  /** Cible tactile minimale (WCAG 2.5.5 / iOS HIG / Material). */
  minTouchTarget: 44,
  /** Plafond de mise à l'échelle des polices : honore le dynamic type sans casser la mise en page. */
  maxFontScale: 1.8,
} as const;

/**
 * Variantes annoncées « en-tête » par les lecteurs d'écran. Seul `h1` (titre de chaque
 * écran, une seule occurrence) est traité comme en-tête : `display`/`h2` sont des variantes
 * surchargées (grands nombres, emojis, icônes) et pollueraient la navigation par titres.
 */
export const HEADING_VARIANTS: readonly TypographyVariant[] = ['h1'];

export function isHeadingVariant(v: TypographyVariant): boolean {
  return HEADING_VARIANTS.includes(v);
}

/**
 * hitSlop portant une cible tactile mesurée à `min` sans changer sa taille visuelle.
 * Retourne un rembourrage nul si la cible est déjà assez grande.
 */
export function hitSlopFor(
  size: number,
  min = A11Y.minTouchTarget,
): { top: number; bottom: number; left: number; right: number } {
  const pad = Math.max(0, Math.ceil((min - size) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
}

/** Props masquant un élément purement décoratif aux technologies d'assistance. */
export const decorative: AccessibilityProps = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
};

/** Props annonçant un en-tête aux lecteurs d'écran. */
export const headingA11yProps: AccessibilityProps = { accessibilityRole: 'header' };
