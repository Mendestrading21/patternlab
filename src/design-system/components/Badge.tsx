import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

export type BadgeProps = {
  /** Nombre (les 0 ne s'affichent pas) ou court libellé. */
  value: number | string;
  /** Couleur du texte/liseré ; défaut = accent primaire. */
  color?: string;
  /** Fond « plein » (texte foncé) plutôt que contour. */
  filled?: boolean;
};

/** Pastille compacte de comptage/statut (ex. nombre de favoris sur un segment). */
export function Badge({ value, color = theme.colors.primary, filled = false }: BadgeProps) {
  if (typeof value === 'number' && value <= 0) return null;
  return (
    <View
      style={[
        styles.badge,
        filled
          ? { backgroundColor: color, borderColor: color }
          : { borderColor: color, backgroundColor: 'transparent' },
      ]}
    >
      <Text variant="caption" color={filled ? theme.colors.onPrimary : color}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
