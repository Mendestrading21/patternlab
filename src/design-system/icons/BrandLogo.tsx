import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Polyline, Circle } from 'react-native-svg';
import { Text } from '../components/Text';
import { theme } from '../theme';

/**
 * Marque Trademy — mark ORIGINAL (tuile violette + courbe de marché ascendante) et
 * wordmark. Aucune image externe. Le violet est la couleur de marque ; le trait clair
 * évoque « apprendre à lire le marché ». Réf. : docs/design/TRADEMY_LEARNING_GLASS.md.
 */
export type BrandLogoProps = {
  /** Hauteur de la tuile (le wordmark s'échelonne avec). Défaut 28. */
  size?: number;
  /** Afficher le mot « Trademy » à côté du mark. Défaut true. */
  showWordmark?: boolean;
  /** Couleur du wordmark. Défaut texte primaire. */
  color?: string;
  accessibilityLabel?: string;
};

export function BrandLogo({
  size = 28,
  showWordmark = true,
  color = theme.colors.textPrimary,
  accessibilityLabel = 'Trademy',
}: BrandLogoProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Defs>
          <LinearGradient id="trademyMark" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={theme.colors.primaryBright} />
            <Stop offset="1" stopColor={theme.colors.primaryDim} />
          </LinearGradient>
        </Defs>
        <Rect x="1.5" y="1.5" width="29" height="29" rx="8.5" fill="url(#trademyMark)" />
        <Polyline
          points="7,21 13,15 18,18 25,9"
          fill="none"
          stroke={theme.colors.textPrimary}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="25" cy="9" r="2.1" fill={theme.colors.textPrimary} />
      </Svg>
      {showWordmark ? (
        <Text variant="h2" color={color} style={{ fontSize: size * 0.72, lineHeight: size * 0.86 }}>
          Trademy
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
});
