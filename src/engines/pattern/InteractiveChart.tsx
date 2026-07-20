import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors } from '../../design-system/tokens';
import type { Candle } from './types';
import { priceScale } from './interactive';
import { describeCandles } from './chartA11y';

export type InteractiveChartProps = {
  candles: Candle[];
  width?: number;
  height?: number;
  /** Niveau tracé par l'utilisateur (prix), ou null. */
  userPrice: number | null;
  /** Niveau cible révélé (prix), ou null tant qu'il n'est pas montré. */
  targetPrice?: number | null;
  disabled?: boolean;
  /** Appelé avec le prix correspondant à l'endroit touché. */
  onPickPrice: (price: number) => void;
};

/**
 * Graphique en chandeliers déterministe où l'on trace un niveau horizontal au toucher.
 * Le tap est capté via le système de responder (compatible iOS/Android/web).
 */
export function InteractiveChart({
  candles,
  width = 300,
  height = 170,
  userPrice,
  targetPrice,
  disabled,
  onPickPrice,
}: InteractiveChartProps) {
  const scale = priceScale(candles, height);
  const n = candles.length;
  const slot = width / n;
  const bodyW = Math.max(2, slot * 0.6);
  const y = scale.priceToY;

  return (
    <View
      style={{ width, height }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Graphique interactif : touche pour placer ton niveau horizontal. ${describeCandles(candles)}`}
      onStartShouldSetResponder={() => !disabled}
      onResponderRelease={(e) => {
        if (!disabled) onPickPrice(scale.yToPrice(e.nativeEvent.locationY));
      }}
    >
      <Svg width={width} height={height}>
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
        {targetPrice != null ? (
          <Line x1={0} x2={width} y1={y(targetPrice)} y2={y(targetPrice)} stroke={colors.bullish} strokeWidth={2} />
        ) : null}
        {userPrice != null ? (
          <Line
            x1={0}
            x2={width}
            y1={y(userPrice)}
            y2={y(userPrice)}
            stroke={colors.technical}
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        ) : null}
      </Svg>
    </View>
  );
}
