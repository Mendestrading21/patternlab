import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'reward';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  /** Raison affichée quand le bouton est désactivé (règle kit : aucun bouton mort silencieux). */
  disabledReason?: string;
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  disabledReason,
  fullWidth = true,
  accessibilityHint,
  style,
}: ButtonProps) {
  const isDisabled = disabled || !onPress;
  const palette = VARIANTS[variant];

  return (
    <View style={fullWidth ? styles.block : undefined}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityHint={accessibilityHint ?? (isDisabled ? disabledReason : undefined)}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          { backgroundColor: palette.bg, borderColor: palette.border },
          fullWidth && styles.block,
          pressed && !isDisabled ? styles.pressed : null,
          isDisabled ? styles.disabled : null,
          style,
        ]}
      >
        <Text variant="title" color={palette.fg} center>
          {label}
        </Text>
      </Pressable>
      {isDisabled && disabledReason ? (
        <Text variant="caption" color={theme.colors.textMuted} center style={styles.reason}>
          {disabledReason}
        </Text>
      ) : null}
    </View>
  );
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: theme.colors.primary, fg: theme.colors.onPrimary, border: theme.colors.primary },
  secondary: {
    bg: theme.colors.surfaceElevated,
    fg: theme.colors.textPrimary,
    border: theme.colors.borderStrong,
  },
  ghost: { bg: 'transparent', fg: theme.colors.textSecondary, border: theme.colors.border },
  reward: { bg: theme.colors.reward, fg: theme.colors.onReward, border: theme.colors.reward },
};

const styles = StyleSheet.create({
  block: { width: '100%' },
  base: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  reason: { marginTop: theme.spacing.xs },
});
