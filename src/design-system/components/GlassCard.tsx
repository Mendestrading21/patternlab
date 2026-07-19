import { View, type ViewProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

export type GlassCardProps = ViewProps & {
  padded?: boolean;
};

/**
 * Carte « verre sombre contrôlé » (≈ 20 % de l'identité V5) : voile translucide + liseré clair
 * + profondeur discrète. À réserver aux blocs héros (visuel, résumé) — pas chaque bloc en carte.
 * Le texte reste `textPrimary`/`textSecondary` (AA garanti sur les surfaces opaques sous-jacentes).
 */
export function GlassCard({ padded = true, style, ...rest }: GlassCardProps) {
  return <View style={[styles.card, padded && styles.padded, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.glass,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    ...theme.elevation.card,
  },
  padded: { padding: theme.spacing.lg },
});
