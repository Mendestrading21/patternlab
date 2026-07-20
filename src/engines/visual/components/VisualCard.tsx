import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, theme } from '@/design-system';
import type { VisualSpec } from '../../../data/learningConcept';
import { datasetByKey } from '../visualDatasets';
import { CandlestickGlyphs, type Zone, type Level } from './CandlestickGlyphs';
import { CandleAnatomy } from './CandleAnatomy';
import { IndicatorPanel } from './IndicatorPanel';
import { OptionPayoff } from './OptionPayoff';
import { VolumeProfile } from './VolumeProfile';
import { ComparisonVisual } from './ComparisonVisual';
import { CheatSheetVisual } from './CheatSheetVisual';
import { figureOverlay } from '../figureOverlays';
import { indicatorConfig } from '../indicatorConfigs';
import { riskSetup } from '../riskSetups';
import { comparison } from '../comparisons';
import { cheatSheet } from '../cheatSheets';

export type VisualCardProps = {
  spec: VisualSpec;
  /** Titre optionnel affiché au-dessus du visuel. */
  title?: string;
  /**
   * Mode « énigme » (Lot reconnaissance) : masque étiquettes et résumé, et remplace l'alternative
   * textuelle par un libellé neutre — pour que la figure soit à deviner sans que la réponse fuite
   * (y compris au lecteur d'écran). Le résumé est révélé après réponse par l'écran appelant.
   */
  blind?: boolean;
};

/**
 * Rend un `VisualSpec` : dispatch par `type` vers le bon générateur SVG. Le résumé accessible
 * est visible ET porté par `accessibilityLabel` (information jamais transmise par la seule couleur).
 * Les types non encore couverts affichent un repli lisible.
 */
export function VisualCard({ spec, title, blind = false }: VisualCardProps) {
  const candles = datasetByKey(spec.datasetKey);
  const summary = blind ? 'Graphique d’une figure à reconnaître.' : spec.accessibilitySummary;
  const cmp = spec.type === 'comparison' ? comparison(spec.variant) : undefined;
  const cheat = spec.type === 'cheat-sheet' ? cheatSheet(spec.variant) : undefined;

  let visual: ReactNode;
  if (spec.type === 'candle-anatomy' && candles[0]) {
    visual = <CandleAnatomy candle={candles[0]} accessibilityLabel={summary} />;
  } else if (spec.type === 'candlestick-pattern' && candles.length) {
    visual = <CandlestickGlyphs candles={candles} accessibilityLabel={summary} />;
  } else if (spec.type === 'chart-pattern' && candles.length) {
    // Les figures chartistes portent des tracés (ligne de cou, tendances, canaux) via le registre.
    // En mode énigme, on garde la géométrie mais on retire les textes révélateurs (labels, repères).
    const overlay = figureOverlay(spec.variant);
    const guides = blind ? overlay?.guides?.map((g) => ({ ...g, label: undefined })) : overlay?.guides;
    const zones = blind ? overlay?.zones?.map((z) => ({ ...z, label: undefined })) : overlay?.zones;
    const markers = blind ? undefined : overlay?.markers;
    visual = (
      <CandlestickGlyphs candles={candles} guides={guides} zones={zones} markers={markers} accessibilityLabel={summary} />
    );
  } else if (spec.type === 'market-structure' && candles.length) {
    const min = Math.min(...candles.map((c) => c.l));
    const max = Math.max(...candles.map((c) => c.h));
    const range = max - min || 1;
    const zones: Zone[] = [
      { from: min, to: min + range * 0.06, label: blind ? undefined : 'support', color: theme.colors.bullish },
      { from: max - range * 0.06, to: max, label: blind ? undefined : 'résistance', color: theme.colors.bearish },
    ];
    visual = <CandlestickGlyphs candles={candles} zones={zones} accessibilityLabel={summary} />;
  } else if (spec.type === 'indicator' && candles.length) {
    const config = indicatorConfig(spec.variant);
    visual = config ? (
      <IndicatorPanel candles={candles} config={config} accessibilityLabel={summary} />
    ) : (
      <CandlestickGlyphs candles={candles} accessibilityLabel={summary} />
    );
  } else if (spec.type === 'risk-reward' && candles.length) {
    // Schéma risque/rendement : entrée, stop (risque, rouge), cible (rendement, vert) + zones.
    const rs = riskSetup(spec.variant);
    if (rs) {
      const levels: Level[] = [
        { price: rs.entry, label: blind ? undefined : 'Entrée', color: theme.colors.technical },
        { price: rs.stop, label: blind ? undefined : 'Stop', color: theme.colors.bearish, dashed: true },
        { price: rs.target, label: blind ? undefined : `Cible · ${rs.ratio}`, color: theme.colors.bullish, dashed: true },
      ];
      const zones: Zone[] = [
        { from: rs.stop, to: rs.entry, color: theme.colors.bearish },
        { from: rs.entry, to: rs.target, color: theme.colors.bullish },
      ];
      visual = <CandlestickGlyphs candles={candles} levels={levels} zones={zones} accessibilityLabel={summary} />;
    } else {
      visual = <CandlestickGlyphs candles={candles} accessibilityLabel={summary} />;
    }
  } else if (spec.type === 'option-payoff') {
    // Diagramme de payoff (call/put) — pas de dataset OHLC, rendu dédié.
    visual = <OptionPayoff kind={spec.variant === 'put' ? 'put' : 'call'} hideLabels={blind} accessibilityLabel={summary} />;
  } else if (spec.type === 'volume-profile' && candles.length) {
    // Profil de volume : barres de volume par palier de prix (POC mis en avant).
    visual = <VolumeProfile candles={candles} accessibilityLabel={summary} />;
  } else if (spec.type === 'comparison' && cmp) {
    // Comparaison côte à côte de deux schémas (ex. haussière vs baissière).
    visual = <ComparisonVisual comparison={cmp} accessibilityLabel={summary} />;
  } else if (spec.type === 'cheat-sheet' && cheat) {
    // Aide-mémoire : grille de mini-schémas légendés.
    visual = <CheatSheetVisual items={cheat} accessibilityLabel={summary} />;
  } else {
    visual = (
      <View style={styles.fallback} accessible accessibilityLabel={summary}>
        <Text variant="caption" color={theme.colors.textMuted} center>
          Visuel « {spec.variant} » — aperçu à venir.
        </Text>
      </View>
    );
  }

  return (
    <Card elevated>
      {title ? (
        <Text variant="label" color={theme.colors.textMuted}>
          {title}
        </Text>
      ) : null}
      <View style={styles.frame}>{visual}</View>
      {!blind && spec.labels.length ? (
        <View style={styles.chips}>
          {spec.labels.map((l) => (
            <Text key={l.text} variant="caption" color={theme.colors.textSecondary} style={styles.chip}>
              {l.text}
            </Text>
          ))}
        </View>
      ) : null}
      {!blind ? (
        <Text variant="caption" color={theme.colors.textMuted}>
          {summary}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  frame: { marginVertical: theme.spacing.sm },
  fallback: { minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, marginBottom: theme.spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
});
