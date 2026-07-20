import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { theme } from '../theme';
import type { TypographyVariant } from '../tokens';
import { A11Y, isHeadingVariant } from '../a11y';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  center?: boolean;
};

/**
 * Texte typé sur l'échelle typographique. Toute chaîne visible passe par ici.
 * Accessibilité : les titres (display/h1/h2) sont annoncés « en-tête » aux lecteurs
 * d'écran, et la mise à l'échelle des polices est honorée avec un plafond raisonnable.
 */
export function Text({
  variant = 'body',
  color,
  center,
  style,
  accessibilityRole,
  maxFontSizeMultiplier,
  ...rest
}: AppTextProps) {
  const base = theme.typography[variant] as TextStyle;
  const role = accessibilityRole ?? (isHeadingVariant(variant) ? 'header' : undefined);
  return (
    <RNText
      accessibilityRole={role}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? A11Y.maxFontScale}
      style={[
        base,
        { color: color ?? theme.colors.textPrimary },
        center ? { textAlign: 'center' } : null,
        style,
      ]}
      {...rest}
    />
  );
}
