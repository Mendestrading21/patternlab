import { View } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../design-system/tokens';
import { priceScale } from '../../pattern/interactive';
import { candleLayout, type Box } from '../candleGeometry';
import type { Candle } from '../../pattern/types';

export interface Level {
  price: number;
  label?: string;
  color?: string;
  dashed?: boolean;
}
export interface Zone {
  from: number;
  to: number;
  label?: string;
  color?: string;
}

export type CandlestickGlyphsProps = {
  candles: Candle[];
  box?: Box;
  levels?: Level[];
  zones?: Zone[];
  accessibilityLabel?: string;
};

/** Rendu de bougies (SVG, responsive via viewBox) avec zones et niveaux optionnels. */
export function CandlestickGlyphs({
  candles,
  box = { width: 320, height: 180, padY: 14 },
  levels = [],
  zones = [],
  accessibilityLabel,
}: CandlestickGlyphsProps) {
  const W = box.width;
  const H = box.height;
  const padY = box.padY ?? 14;
  const scale = priceScale(candles, H, padY);
  const layout = candleLayout(candles, box);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {zones.map((z, i) => {
          const yTop = scale.priceToY(z.to);
          const yBot = scale.priceToY(z.from);
          return (
            <Rect
              key={`z-${i}`}
              x={0}
              y={Math.min(yTop, yBot)}
              width={W}
              height={Math.max(2, Math.abs(yBot - yTop))}
              fill={z.color ?? colors.neutral}
              fillOpacity={0.16}
            />
          );
        })}
        {levels.map((lv, i) => (
          <Line
            key={`l-${i}`}
            x1={0}
            y1={scale.priceToY(lv.price)}
            x2={W}
            y2={scale.priceToY(lv.price)}
            stroke={lv.color ?? colors.technical}
            strokeWidth={1.2}
            strokeDasharray={lv.dashed ? '5 4' : undefined}
          />
        ))}
        {layout.map((c) => (
          <Line
            key={`w-${c.index}`}
            x1={c.wickX}
            y1={c.wickTop}
            x2={c.wickX}
            y2={c.wickBottom}
            stroke={c.up ? colors.bullish : colors.bearish}
            strokeWidth={1.4}
          />
        ))}
        {layout.map((c) => (
          <Rect
            key={`b-${c.index}`}
            x={c.bodyX}
            y={c.bodyY}
            width={c.bodyW}
            height={c.bodyH}
            fill={c.up ? colors.bullish : colors.bearish}
            rx={1}
          />
        ))}
        {zones
          .filter((z) => z.label)
          .map((z, i) => (
            <SvgText key={`zt-${i}`} x={6} y={Math.max(12, scale.priceToY(z.to) - 4)} fill={colors.textMuted} fontSize={10}>
              {z.label}
            </SvgText>
          ))}
        {levels
          .filter((l) => l.label)
          .map((l, i) => (
            <SvgText key={`lt-${i}`} x={W - 4} y={scale.priceToY(l.price) - 4} fill={colors.textMuted} fontSize={10} textAnchor="end">
              {l.label}
            </SvgText>
          ))}
      </Svg>
    </View>
  );
}
