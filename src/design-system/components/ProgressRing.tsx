import { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../theme';
import { Text } from './Text';

/**
 * Anneau de progression (Trademy Learning Glass). Progression bornée 0→1, couleur de
 * marque par défaut. Le centre affiche `children` ou le pourcentage. Statique et
 * accessible (valeur exposée au lecteur d'écran).
 */
export type ProgressRingProps = {
  /** Progression 0 → 1 (bornée). */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  /** Contenu central. Par défaut le pourcentage arrondi. */
  children?: ReactNode;
  accessibilityLabel?: string;
};

export function ProgressRing({
  progress,
  size = 56,
  strokeWidth = 6,
  color = theme.colors.primary,
  trackColor = theme.colors.surfaceInteractive,
  children,
  accessibilityLabel,
}: ProgressRingProps) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.round(p * 100);

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      accessibilityLabel={accessibilityLabel ?? `Progression ${pct}%`}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children ?? (
          <Text variant="label" color={theme.colors.textPrimary}>
            {pct}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
