import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

export type ChipProps = {
  icon?: string;
  label: string;
  color?: string;
  accessibilityLabel?: string;
};

/** Petite pastille pour XP, série (streak), pièces, niveau… */
export function Chip({ icon, label, color, accessibilityLabel }: ChipProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.chip, color ? { borderColor: color } : null]}
    >
      {icon ? <Text variant="caption">{icon}</Text> : null}
      <Text variant="label" color={color ?? theme.colors.textPrimary}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceElevated,
  },
});
