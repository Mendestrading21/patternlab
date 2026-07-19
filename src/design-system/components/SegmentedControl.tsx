import { View, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { hitSlopFor } from '../a11y';
import { Text } from './Text';
import { Badge } from './Badge';

export type SegmentOption<T extends string> = {
  id: T;
  label: string;
  /** Compteur optionnel affiché en pastille (0 masqué). */
  badge?: number;
};

export type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (id: T) => void;
  accessibilityLabel?: string;
};

/**
 * Barre de segments (vue/filtre) accessible — un seul actif à la fois.
 * Remplace les onglets « pilule » écrits à la main. `accessibilityState.selected`
 * + contraste onPrimary garantissent que l'état ne repose pas sur la seule couleur.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            hitSlop={hitSlopFor(32)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text variant="label" color={active ? theme.colors.onPrimary : theme.colors.textSecondary}>
              {opt.label}
            </Text>
            {opt.badge ? (
              <Badge value={opt.badge} color={active ? theme.colors.onPrimary : theme.colors.primary} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.xs, flexWrap: 'wrap' },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  segmentActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
});
