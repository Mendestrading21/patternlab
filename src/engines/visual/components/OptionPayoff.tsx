import { View } from 'react-native';
import Svg, { Line, Polyline, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../design-system/tokens';

export type OptionKind = 'call' | 'put';

const W = 300;
const H = 170;
const PAD = 22;
const STRIKE = 50;
const PREMIUM = 8;

/** Payoff d'une option à l'échéance : max(0, u−strike) pour un call, max(0, strike−u) pour un put, moins la prime. */
function payoff(kind: OptionKind, u: number): number {
  const intrinsic = kind === 'call' ? Math.max(0, u - STRIKE) : Math.max(0, STRIKE - u);
  return intrinsic - PREMIUM;
}

/**
 * Diagramme de payoff d'option (call / put) — schéma en « crosse de hockey ».
 * Perte bornée à la prime, seuil de rentabilité marqué. Pédagogique, jamais un conseil.
 */
export function OptionPayoff({
  kind,
  accessibilityLabel,
  hideLabels = false,
}: {
  kind: OptionKind;
  accessibilityLabel?: string;
  hideLabels?: boolean;
}) {
  const uMin = 20;
  const uMax = 80;
  const us = Array.from({ length: 61 }, (_, i) => uMin + i);
  const pays = us.map((u) => payoff(kind, u));
  const pMin = Math.min(...pays);
  const pMax = Math.max(...pays);
  const range = pMax - pMin || 1;

  const x = (u: number) => PAD + ((u - uMin) / (uMax - uMin)) * (W - 2 * PAD);
  const y = (p: number) => PAD + (1 - (p - pMin) / range) * (H - 2 * PAD);

  const points = us.map((u, i) => `${x(u).toFixed(1)},${y(pays[i]).toFixed(1)}`).join(' ');
  const breakeven = kind === 'call' ? STRIKE + PREMIUM : STRIKE - PREMIUM;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Ligne de zéro (ni gain ni perte) */}
        <Line x1={PAD} y1={y(0)} x2={W - PAD} y2={y(0)} stroke={colors.textMuted} strokeWidth={1} strokeDasharray="4 3" />
        {/* Strike (prix d'exercice) */}
        <Line x1={x(STRIKE)} y1={PAD} x2={x(STRIKE)} y2={H - PAD} stroke={colors.advanced} strokeWidth={1} strokeDasharray="3 3" />
        {/* Courbe de payoff */}
        <Polyline points={points} fill="none" stroke={colors.technical} strokeWidth={2} />
        {/* Seuil de rentabilité (payoff = 0) */}
        <Circle cx={x(breakeven)} cy={y(0)} r={3.5} fill={colors.bullish} />
        {hideLabels ? null : (
          <>
            <SvgText x={x(STRIKE)} y={PAD - 6} fill={colors.textMuted} fontSize={10} textAnchor="middle">
              strike
            </SvgText>
            <SvgText x={x(breakeven)} y={y(0) - 6} fill={colors.textSecondary} fontSize={10} textAnchor="middle">
              seuil
            </SvgText>
            <SvgText x={PAD} y={y(pMin) + 3} fill={colors.bearish} fontSize={9}>
              perte = prime
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}
