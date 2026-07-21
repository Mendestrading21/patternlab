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
/** Point d'ancrage d'un tracé : index de bougie (fractionnaire accepté) + prix. */
export interface GuidePoint {
  i: number;
  price: number;
}
/** Tracé libre (ligne de cou, ligne de tendance, projection) entre deux ancrages. */
export interface Guide {
  from: GuidePoint;
  to: GuidePoint;
  color?: string;
  dashed?: boolean;
  label?: string;
}
/** Repère textuel positionné (ex. « épaule », « cou », « ▲ cible »). */
export interface Marker {
  i: number;
  price: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}

export type CandlestickGlyphsProps = {
  candles: Candle[];
  box?: Box;
  levels?: Level[];
  zones?: Zone[];
  guides?: Guide[];
  markers?: Marker[];
  /** Grille horizontale subtile (aide à la lecture). Activée par défaut. */
  grid?: boolean;
  /** Décoratif : masque ce schéma à l'accessibilité (le parent porte le résumé). */
  decorative?: boolean;
  accessibilityLabel?: string;
};

/** Nombre d'intervalles de la grille horizontale. */
const GRID_ROWS = 4;

/** Rendu de bougies (SVG, responsive via viewBox) avec zones, niveaux, tracés et repères optionnels. */
export function CandlestickGlyphs({
  candles,
  box = { width: 320, height: 180, padY: 14 },
  levels = [],
  zones = [],
  guides = [],
  markers = [],
  grid = true,
  decorative = false,
  accessibilityLabel,
}: CandlestickGlyphsProps) {
  const W = box.width;
  const H = box.height;
  const padY = box.padY ?? 14;
  const scale = priceScale(candles, H, padY);
  const layout = candleLayout(candles, box);
  const n = candles.length || 1;
  const slot = W / n;
  const xAt = (i: number) => Math.max(0, Math.min(W, i * slot + slot / 2));

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : undefined}
    >
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {grid
          ? Array.from({ length: GRID_ROWS + 1 }, (_, i) => {
              const gy = padY + (i / GRID_ROWS) * (H - 2 * padY);
              return (
                <Line
                  key={`grid-${i}`}
                  x1={0}
                  y1={gy}
                  x2={W}
                  y2={gy}
                  stroke={colors.border}
                  strokeWidth={0.5}
                  strokeOpacity={0.6}
                />
              );
            })
          : null}
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
        {guides.map((g, i) => (
          <Line
            key={`g-${i}`}
            x1={xAt(g.from.i)}
            y1={scale.priceToY(g.from.price)}
            x2={xAt(g.to.i)}
            y2={scale.priceToY(g.to.price)}
            stroke={g.color ?? colors.technical}
            strokeWidth={1.4}
            strokeDasharray={g.dashed ? '5 4' : undefined}
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
        {guides
          .filter((g) => g.label)
          .map((g, i) => (
            <SvgText
              key={`gt-${i}`}
              x={(xAt(g.from.i) + xAt(g.to.i)) / 2}
              y={(scale.priceToY(g.from.price) + scale.priceToY(g.to.price)) / 2 - 4}
              fill={colors.textMuted}
              fontSize={10}
              textAnchor="middle"
            >
              {g.label}
            </SvgText>
          ))}
        {markers.map((m, i) => (
          <SvgText
            key={`m-${i}`}
            x={xAt(m.i)}
            y={scale.priceToY(m.price)}
            fill={m.color ?? colors.textSecondary}
            fontSize={10}
            textAnchor={m.anchor ?? 'middle'}
          >
            {m.text}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
