import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors } from '../../design-system/tokens';
import type { Candle } from './types';
import { describeCandles } from './chartA11y';

export type PatternChartProps = {
  candles: Candle[];
  width?: number;
  height?: number;
  /** Grille horizontale subtile (aide à la lecture). Activée par défaut. */
  grid?: boolean;
  /**
   * Résumé accessible à afficher (lecteur d'écran). Par défaut, dérivé des bougies (`describeCandles`).
   * Un appelant peut passer le résumé CANONIQUE porté par l'exercice — une seule vérité, jamais un
   * second calcul concurrent.
   */
  accessibilityLabel?: string;
};

const GRID_ROWS = 4;

/** Rendu en chandeliers japonais (SVG). Vert = clôture ≥ ouverture, rouge sinon (sémantique FINANCIÈRE). */
export function PatternChart({ candles, width = 320, height = 180, grid = true, accessibilityLabel }: PatternChartProps) {
  const padY = 12;
  const values = candles.flatMap((c) => [c.h, c.l]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const n = candles.length;
  const slot = width / n;
  const bodyW = Math.max(2, slot * 0.6);

  const y = (v: number) => padY + (1 - (v - min) / range) * (height - 2 * padY);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel ?? describeCandles(candles)}>
      <Svg width={width} height={height}>
        {grid
          ? Array.from({ length: GRID_ROWS + 1 }, (_, i) => {
              const gy = padY + (i / GRID_ROWS) * (height - 2 * padY);
              return (
                <Line
                  key={`grid-${i}`}
                  x1={0}
                  y1={gy}
                  x2={width}
                  y2={gy}
                  stroke={colors.border}
                  strokeWidth={0.5}
                  strokeOpacity={0.6}
                />
              );
            })
          : null}
        {candles.map((c, i) => {
          const cx = i * slot + slot / 2;
          const up = c.c >= c.o;
          const stroke = up ? colors.bullish : colors.bearish;
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyH = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
          return (
            <Rect key={`b-${i}`} x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={stroke} rx={1} />
          );
        })}
        {candles.map((c, i) => {
          const cx = i * slot + slot / 2;
          const up = c.c >= c.o;
          const stroke = up ? colors.bullish : colors.bearish;
          return <Line key={`w-${i}`} x1={cx} y1={y(c.h)} x2={cx} y2={y(c.l)} stroke={stroke} strokeWidth={1.4} />;
        })}
      </Svg>
    </View>
  );
}
