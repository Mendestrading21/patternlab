import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { theme } from '../theme';
import { TrademyIcon, type TrademyIconName } from '../icons/TrademyIcon';

/**
 * Bouton-icône Trademy. `accessibilityLabel` OBLIGATOIRE (aucune action sans nom
 * lisible). Cible tactile ≥ 44 px. Utilise le système d'icônes Trademy, jamais un emoji.
 */
export type IconButtonProps = {
  name: TrademyIconName;
  onPress?: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  size?: number;
  color?: string;
  variant?: 'ghost' | 'solid' | 'primary';
  disabled?: boolean;
  style?: ViewStyle;
};

export function IconButton({
  name,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  size = 22,
  color,
  variant = 'ghost',
  disabled = false,
  style,
}: IconButtonProps) {
  const isDisabled = disabled || !onPress;
  const v = VARIANTS[variant];
  const iconColor = color ?? v.fg;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      <TrademyIcon name={name} size={size} color={iconColor} />
    </Pressable>
  );
}

const VARIANTS: Record<NonNullable<IconButtonProps['variant']>, { bg: string; fg: string; border: string }> = {
  ghost: { bg: 'transparent', fg: theme.colors.textSecondary, border: 'transparent' },
  solid: { bg: theme.colors.surfaceElevated, fg: theme.colors.textPrimary, border: theme.colors.border },
  primary: { bg: theme.colors.primary, fg: theme.colors.onPrimary, border: theme.colors.primary },
};

const styles = StyleSheet.create({
  base: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  disabled: { opacity: 0.4 },
});
