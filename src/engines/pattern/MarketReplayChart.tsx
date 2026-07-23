import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors } from '../../design-system/tokens';
import type { Candle } from './types';
import { priceScale } from './interactive';
import { volumeSeries, maxVolume } from './chartEngine';

export type MarketReplayChartProps = {
  candles: Candle[];
  /** Nombre de bougies révélées (replay). Défaut = toutes. */
  visibleCount?: number;
  /**
   * Largeur en pixels. **Omettre** pour que le graphique remplisse la largeur de son conteneur
   * (mesurée via `onLayout`) — recommandé pour un rendu mobile qui occupe toute la carte.
   */
  width?: number;
  height?: number;
  /** Hauteur du panneau de volume sous les chandeliers. */
  volumeHeight?: number;
  /** Affiche le panneau de volume (participation). */
  showVolume?: boolean;
};

/**
 * Chandeliers déterministes avec **replay** (série clippée à `visibleCount`) et **volume**.
 * L'échelle de prix est calculée sur la série COMPLÈTE : l'axe ne saute pas pendant le replay.
 * Statique (aucune animation) — le replay n'avance qu'au toucher. Non interactif ici :
 * la logique (état de replay, série de volume) vit dans `chartEngine.ts`, pur et testé.
 * L'information n'est jamais portée par la seule couleur : un `accessibilityLabel` résume
 * la progression, la dernière clôture et la participation.
 */
export function MarketReplayChart({
  candles,
  visibleCount,
  width,
  height = 150,
  volumeHeight = 44,
  showVolume = true,
}: MarketReplayChartProps) {
  // Largeur explicite prioritaire ; sinon largeur mesurée du conteneur (repli 300 avant la 1re mesure).
  const [measured, setMeasured] = useState(0);
  const w = width ?? (measured || 300);
  const onLayout =
    width == null
      ? (e: LayoutChangeEvent) => {
          const next = Math.round(e.nativeEvent.layout.width);
          if (next > 0 && next !== measured) setMeasured(next);
        }
      : undefined;

  const total = candles.length;
  const shown = Math.max(0, Math.min(visibleCount ?? total, total));
  const priceH = showVolume ? height - volumeHeight - 6 : height;
  const scale = priceScale(candles, priceH); // échelle sur la série complète (axe stable)
  const y = scale.priceToY;
  // Les bougies révélées occupent toute la largeur : le graphique n'est jamais à moitié vide en
  // début de replay (il se remplit en se resserrant). La largeur de corps est bornée pour rester
  // lisible quand peu de bougies sont visibles (évite une bougie unique démesurée).
  const slot = shown > 0 ? w / shown : w;
  const bodyW = Math.min(22, Math.max(2, slot * 0.6));

  const volumes = volumeSeries(candles);
  const vMax = maxVolume(volumes) || 1;
  const volTop = priceH + 6;

  const last = shown > 0 ? candles[shown - 1] : null;
  const trend = last ? (last.c >= last.o ? 'haussière' : 'baissière') : 'neutre';
  const label = last
    ? `Graphique en chandeliers, ${shown} bougie${shown > 1 ? 's' : ''} sur ${total} révélée${shown > 1 ? 's' : ''}. ` +
      `Dernière clôture ${last.c.toFixed(0)}, bougie ${trend}` +
      (showVolume ? `, volume ${volumes[shown - 1].toFixed(0)} (participation).` : '.')
    : 'Graphique en chandeliers, aucune bougie révélée.';

  return (
    <View
      style={{ width: width ?? '100%', height }}
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      <Svg width={w} height={height}>
        {/* Mèches révélées */}
        {candles.slice(0, shown).map((c, i) => {
          const cx = i * slot + slot / 2;
          const up = c.c >= c.o;
          const stroke = up ? colors.bullish : colors.bearish;
          return <Line key={`w-${i}`} x1={cx} y1={y(c.h)} x2={cx} y2={y(c.l)} stroke={stroke} strokeWidth={1.4} />;
        })}
        {/* Corps révélés */}
        {candles.slice(0, shown).map((c, i) => {
          const cx = i * slot + slot / 2;
          const up = c.c >= c.o;
          const stroke = up ? colors.bullish : colors.bearish;
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyH = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
          return <Rect key={`b-${i}`} x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={stroke} rx={1} />;
        })}

        {/* Panneau de volume (participation) */}
        {showVolume
          ? candles.slice(0, shown).map((c, i) => {
              const cx = i * slot + slot / 2;
              const up = c.c >= c.o;
              const h = Math.max(1, (volumes[i] / vMax) * (volumeHeight - 4));
              return (
                <Rect
                  key={`v-${i}`}
                  x={cx - bodyW / 2}
                  y={volTop + (volumeHeight - 4 - h)}
                  width={bodyW}
                  height={h}
                  fill={up ? colors.bullish : colors.bearish}
                  opacity={0.45}
                  rx={1}
                />
              );
            })
          : null}
        {showVolume ? (
          <Line x1={0} x2={w} y1={volTop} y2={volTop} stroke={colors.border} strokeWidth={1} />
        ) : null}
      </Svg>
    </View>
  );
}
