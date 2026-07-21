import { View, StyleSheet } from 'react-native';
import { Text, theme } from '@/design-system';
import type { Mechanism } from '../mechanisms';

/**
 * Rend un `Mechanism` : une suite d'étapes fléchées (schéma économie/mécanisme), pas un graphique.
 * Le résumé accessible est porté par `accessibilityLabel` sur le conteneur (une seule annonce AT).
 * `compact` : version verticale pour vignette (MiniVisual).
 */
export function MechanismVisual({
  mechanism,
  compact = false,
  accessibilityLabel,
}: {
  mechanism: Mechanism;
  compact?: boolean;
  accessibilityLabel: string;
}) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={styles.wrap}>
      <View style={[styles.flow, compact && styles.flowCol]}>
        {mechanism.steps.map((s, i) => {
          const last = i >= mechanism.steps.length - 1;
          return (
            <View key={s.label} style={[styles.stepRow, compact && styles.stepRowCol]}>
              <View style={[styles.box, compact && styles.boxCompact]}>
                <Text variant={compact ? 'caption' : 'label'} color={theme.colors.textPrimary} center>
                  {s.label}
                </Text>
                {!compact && s.sub ? (
                  <Text variant="caption" color={theme.colors.textMuted} center>
                    {s.sub}
                  </Text>
                ) : null}
              </View>
              {!last ? (
                <Text variant="title" color={theme.colors.primary} style={styles.arrow}>
                  {compact ? '↓' : '→'}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
      {!compact && mechanism.note ? (
        <Text variant="caption" color={theme.colors.textSecondary} style={styles.note}>
          {mechanism.note}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  flow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
  flowCol: { flexDirection: 'column' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  stepRowCol: { flexDirection: 'column' },
  box: {
    minWidth: 84,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    gap: 2,
  },
  boxCompact: { minWidth: 0, paddingVertical: 4, paddingHorizontal: 6, borderColor: theme.colors.border },
  arrow: { marginHorizontal: 2 },
  note: { textAlign: 'center' },
});
