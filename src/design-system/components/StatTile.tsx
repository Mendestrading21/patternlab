import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { TrademyIcon, type TrademyIconName } from '../icons';
import { theme } from '../theme';

/**
 * StatTile (LOT 4) — tuile de statistique premium, partagée par les écrans de progression.
 * Remplace les tuiles ad hoc dupliquées dans les écrans. Accessible d'un bloc : le lecteur d'écran
 * annonce « label : value » (l'icône reste décorative). La couleur souligne, elle n'informe jamais
 * seule (la valeur + le label portent le sens).
 */
export type StatTileProps = {
  label: string;
  value: string;
  /** Accent de la valeur (token). Défaut : texte primaire. */
  color?: string;
  /** Icône décorative optionnelle (façade Trademy). */
  icon?: TrademyIconName;
  /** Étiquette accessible surchargée (sinon « label : value »). */
  accessibilityLabel?: string;
};

export function StatTile({ label, value, color, icon, accessibilityLabel }: StatTileProps) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={accessibilityLabel ?? `${label} : ${value}`}>
      {icon ? (
        <View style={styles.iconWrap}>
          <TrademyIcon name={icon} size={16} color={color ?? theme.colors.textSecondary} />
        </View>
      ) : null}
      <Text variant="title" color={color ?? theme.colors.textPrimary} center>
        {value}
      </Text>
      <Text variant="caption" color={theme.colors.textMuted} center>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceElevated,
  },
  iconWrap: { marginBottom: 2 },
});
