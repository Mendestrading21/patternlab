import { View } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../design-system/tokens';
import { candleAnatomyParts, type Box } from '../candleGeometry';
import type { Candle } from '../../pattern/types';

export type CandleAnatomyProps = {
  candle: Candle;
  box?: Box;
  accessibilityLabel?: string;
};

/** Anatomie d'UNE bougie : corps + mèches labellisés (SVG responsive). */
export function CandleAnatomy({
  candle,
  box = { width: 320, height: 200, padY: 26 },
  accessibilityLabel,
}: CandleAnatomyProps) {
  const W = box.width;
  const H = box.height;
  const a = candleAnatomyParts(candle, box);
  const col = a.up ? colors.bullish : colors.bearish;
  const labelX = a.body.x + a.body.w + 20;
  const midUpper = (a.upperWick.y1 + a.upperWick.y2) / 2;
  const midLower = (a.lowerWick.y1 + a.lowerWick.y2) / 2;
  const midBody = a.body.y + a.body.h / 2;

  const leader = (y: number, text: string) => [
    <Line key={`ln-${text}`} x1={a.body.x + a.body.w} y1={y} x2={labelX - 4} y2={y} stroke={colors.borderStrong} strokeWidth={1} />,
    <SvgText key={`tx-${text}`} x={labelX} y={y + 4} fill={colors.textSecondary} fontSize={12}>
      {text}
    </SvgText>,
  ];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line x1={a.upperWick.x} y1={a.upperWick.y1} x2={a.upperWick.x} y2={a.upperWick.y2} stroke={col} strokeWidth={2} />
        <Line x1={a.lowerWick.x} y1={a.lowerWick.y1} x2={a.lowerWick.x} y2={a.lowerWick.y2} stroke={col} strokeWidth={2} />
        <Rect x={a.body.x} y={a.body.y} width={a.body.w} height={a.body.h} fill={col} rx={2} />
        {leader(midBody, 'corps')}
        {leader(midUpper, 'mèche haute')}
        {leader(midLower, 'mèche basse')}
      </Svg>
    </View>
  );
}
