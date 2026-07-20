import { View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../design-system/tokens';
import { buildVolumeProfile } from '../volumeProfile';
import type { Candle } from '../../pattern/types';

export type VolumeProfileProps = {
  candles: Candle[];
  bins?: number;
  accessibilityLabel?: string;
};

/**
 * Profil de volume (SVG responsive) : barres horizontales de volume par palier de prix,
 * palier de plus fort volume (POC) mis en avant. Volume synthétique déterministe.
 */
export function VolumeProfile({ candles, bins = 8, accessibilityLabel }: VolumeProfileProps) {
  const W = 320;
  const H = 180;
  const padY = 10;
  const padX = 8;
  const profile = buildVolumeProfile(candles, bins);
  const rows = profile.bins.length || 1;
  const rowH = (H - 2 * padY) / rows;
  const maxV = profile.maxVolume || 1;
  const maxBar = W - 2 * padX - 34;
  const yOf = (index: number) => padY + (rows - 1 - index) * rowH; // prix croissant vers le haut
  const widthOf = (volume: number) => Math.max(2, (volume / maxV) * maxBar);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {profile.bins.map((b) => (
          <Rect
            key={`vp-${b.index}`}
            x={padX}
            y={yOf(b.index) + rowH * 0.15}
            width={widthOf(b.volume)}
            height={Math.max(2, rowH * 0.7)}
            fill={b.isPoc ? colors.reward : colors.technical}
            fillOpacity={b.isPoc ? 0.95 : 0.6}
            rx={1}
          />
        ))}
        {profile.bins
          .filter((b) => b.isPoc)
          .map((b) => (
            <SvgText
              key="poc"
              x={Math.min(W - 22, padX + widthOf(b.volume) + 4)}
              y={yOf(b.index) + rowH * 0.62}
              fill={colors.reward}
              fontSize={9}
            >
              POC
            </SvgText>
          ))}
      </Svg>
    </View>
  );
}
