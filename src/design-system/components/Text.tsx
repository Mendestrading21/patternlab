import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { theme } from '../theme';
import type { TypographyVariant } from '../tokens';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  center?: boolean;
};

/** Texte typé sur l'échelle typographique. Toute chaîne visible passe par ici. */
export function Text({ variant = 'body', color, center, style, ...rest }: AppTextProps) {
  const base = theme.typography[variant] as TextStyle;
  return (
    <RNText
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
