/**
 * PatternLab — Thème.
 * P0.1 : un seul thème « sombre premium » (l'identité de la marque).
 * Le thème clair est prévu mais différé (voir docs/PROJECT_STATUS.md).
 */
import { colors, spacing, radius, typography } from './tokens';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
} as const;

export type Theme = typeof theme;

/** Hook d'accès au thème. Abstrait aujourd'hui pour permettre le multi-thème plus tard. */
export function useTheme(): Theme {
  return theme;
}
