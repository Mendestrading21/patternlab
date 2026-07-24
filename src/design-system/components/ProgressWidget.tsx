import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { StatTile, type StatTileProps } from './StatTile';
import { SignatureMark } from '../brand/SignatureMark';
import { theme } from '../theme';

/**
 * ProgressWidget (LOT 4) — widget « data premium » sombre et vitré, réutilisable pour la progression
 * (globale, monde, compétence). Verre DISCRET (voile léger + liseré fin), lumière localisée, aucun flou
 * coûteux généralisé. N'INVENTE aucune valeur : tout est fourni par l'appelant. Prévoit l'état vide
 * (aucune stat) et reste lisible (contrastes AA, pas de texte minuscule). Résumé accessible d'un bloc.
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
  /** Résumé accessible surchargé (sinon dérivé du titre + légende). */
  accessibilityLabel?: string;
};

export function ProgressWidget({
  title,
  value,
  accent = theme.colors.primary,
  caption,
  stats = [],
  accessibilityLabel,
}: ProgressWidgetProps) {
  const pct = value == null ? null : Math.round(Math.max(0, Math.min(1, value)) * 100);
  const summary =
    accessibilityLabel ??
    [title, pct != null ? `${pct} %` : null, caption].filter(Boolean).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text variant="label" color={theme.colors.textSecondary} accessibilityLabel={summary}>
          {title.toUpperCase()}
        </Text>
        <SignatureMark width={40} accent={accent} />
      </View>

      {value != null ? (
        <ProgressBar value={value} color={accent} accessibilityLabel={`${title} : ${pct} %`} />
      ) : null}

      {caption ? (
        <Text variant="caption" color={theme.colors.textMuted}>
          {caption}
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
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stats: { flexDirection: 'row', gap: theme.spacing.sm },
});
