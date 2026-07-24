import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { TrademyIcon, type TrademyIconName } from '../icons';
import { theme } from '../theme';

/**
 * MarketStatePill (LOT 4) — puce sémantique d'ÉTAT DE MARCHÉ pédagogique.
 *
 * Vocabulaire AUTORISÉ uniquement (jamais BUY/SELL) : setup haussier, setup baissier, zone de
 * confirmation, invalidation, faux signal. Chaque état porte TROIS signaux redondants — icône
 * (forme), libellé (texte) ET couleur — pour que la COULEUR NE SOIT JAMAIS le seul vecteur
 * d'information (WCAG 1.4.1). Haussier/baissier sont des DIRECTIONS, jamais « bien » / « mal ».
 *
 * Purement présentationnel : n'infère ni ne calcule aucune vérité pédagogique. L'appelant fournit
 * l'état ; le composant ne fait que le rendre lisible et accessible.
 */
export type MarketState =
  | 'bullish-setup'
  | 'bearish-setup'
  | 'confirmation'
  | 'invalidation'
  | 'false-signal';

type Descriptor = {
  label: string;
  icon: TrademyIconName;
  /** Couleur d'accent (token). */
  color: string;
  /** Résumé accessible : ce que l'état signifie, sans jargon de trading. */
  a11y: string;
};

/** Registre unique des états — source de vérité pour la puce, la légende et les tests. */
export const MARKET_STATES: Record<MarketState, Descriptor> = {
  'bullish-setup': {
    label: 'Setup haussier',
    icon: 'progression',
    color: theme.colors.bullish,
    a11y: 'Setup haussier : contexte penché vers la hausse, à confirmer.',
  },
  'bearish-setup': {
    label: 'Setup baissier',
    icon: 'decline',
    color: theme.colors.bearish,
    a11y: 'Setup baissier : contexte penché vers la baisse, à confirmer.',
  },
  confirmation: {
    label: 'Zone de confirmation',
    icon: 'confirmation',
    color: theme.colors.confirmation,
    a11y: 'Zone de confirmation : la preuve attendue avant d’envisager une entrée théorique.',
  },
  invalidation: {
    label: 'Invalidation',
    icon: 'invalidation',
    color: theme.colors.invalidation,
    a11y: 'Invalidation : le niveau qui annule le scénario éducatif s’il est franchi.',
  },
  'false-signal': {
    label: 'Faux signal',
    icon: 'false-signal',
    color: theme.colors.falseSignal,
    a11y: 'Faux signal : un leurre qui imite une preuve sans en être une.',
  },
};

export const MARKET_STATE_ORDER: MarketState[] = [
  'bullish-setup',
  'bearish-setup',
  'confirmation',
  'invalidation',
  'false-signal',
];

export type MarketStatePillProps = {
  state: MarketState;
  /** `solid` = accent tenu (fond teinté) ; `subtle` (défaut) = liseré discret sur surface. */
  tone?: 'subtle' | 'solid';
  /** Taille du texte. Défaut `caption`. */
  size?: 'caption' | 'label';
};

/** Convertit un accent hex en fond très légèrement teinté (voile ~14 %). */
function tint(hex: string): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return theme.colors.surfaceElevated;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}

export function MarketStatePill({ state, tone = 'subtle', size = 'caption' }: MarketStatePillProps) {
  const d = MARKET_STATES[state];
  const iconSize = size === 'label' ? 16 : 14;
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={d.a11y}
      style={[
        styles.pill,
        {
          borderColor: d.color,
          backgroundColor: tone === 'solid' ? tint(d.color) : theme.colors.surfaceElevated,
        },
      ]}
    >
      <TrademyIcon name={d.icon} size={iconSize} color={d.color} strokeWidth={2} />
      <Text variant={size} color={d.color}>
        {d.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    borderWidth: theme.borderWidth.regular,
  },
});
