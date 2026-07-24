import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { StatTile, type StatTileProps } from './StatTile';
import { theme } from '../theme';

/**
 * ProgressWidget (LOT 4) — widget « data premium » sombre et vitré, réutilisable pour la progression
 * (globale, monde, compétence). Verre DISCRET (voile léger + liseré fin), aucun flou coûteux généralisé.
 * N'INVENTE aucune valeur : tout est fourni par l'appelant.
 *
 * Accessibilité (LOT 4-A) : le pourcentage n'est annoncé QU'UNE fois — porté par `accessibilityValue`
 * de la barre ; le titre et la barre ne le répètent pas dans leur libellé. L'état vide affiche une
 * explication utile (`emptyLabel`), jamais un simple titre accompagné de la signature.
 */
export type ProgressWidgetProps = {
  title: string;
  /** Progression 0→1 (barre). Optionnel : sans valeur, la barre n'est pas rendue. */
  value?: number;
  /** Couleur d'accent de la barre. Défaut : marque. */
  accent?: string;
  /** Légende sous la barre (ex. « 3/5 étapes »). */
  caption?: string;
  /** Tuiles de statistiques (XP, précision, série…). Vide → rangée omise. */
  stats?: StatTileProps[];
  /**
   * Libellé accessible surchargé de la barre (sinon le titre seul). NE DOIT PAS contenir le
   * pourcentage : celui-ci est porté une seule fois par `accessibilityValue` de la barre. Y inclure
   * « 60 % » recréerait une double annonce (le verrou `StatTile.test.tsx` couvre le chemin par défaut).
   */
  accessibilityLabel?: string;
  /** Message d'état vide (aucune valeur, aucune légende, aucune stat). */
  emptyLabel?: string;
};

export function ProgressWidget({
  title,
  value,
  accent = theme.colors.primary,
  caption,
  stats = [],
  accessibilityLabel,
  emptyLabel = 'Aucune progression enregistrée',
}: ProgressWidgetProps) {
  const isEmpty = value == null && !caption && stats.length === 0;

  return (
    <View style={styles.card}>
      <Text variant="label" color={theme.colors.textSecondary}>
        {title.toUpperCase()}
      </Text>

      {value != null ? (
        // Le libellé ne contient PAS le pourcentage ; celui-ci est porté une seule fois par
        // `accessibilityValue` de la barre (défini dans ProgressBar). Pas de triple annonce.
        <ProgressBar value={value} color={accent} accessibilityLabel={accessibilityLabel ?? title} />
      ) : null}

      {caption ? (
        <Text variant="caption" color={theme.colors.textMuted}>
          {caption}
        </Text>
      ) : null}

      {isEmpty ? (
        <Text variant="caption" color={theme.colors.textMuted}>
          {emptyLabel}
        </Text>
      ) : null}

      {stats.length > 0 ? (
        <View style={styles.stats}>
          {stats.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidth.thin,
    // Verre contrôlé : surface élevée + liseré clair très léger.
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.surfaceElevated,
    ...theme.elevation.card,
  },
  stats: { flexDirection: 'row', gap: theme.spacing.sm },
});
