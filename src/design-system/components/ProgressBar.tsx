import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export type ProgressBarProps = {
  /** Progression de 0 à 1. */
  value: number;
  color?: string;
  height?: number;
  accessibilityLabel?: string;
};

export function ProgressBar({ value, color, height = 10, accessibilityLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2 }]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color ?? theme.colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: theme.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
});
