import { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Button, theme } from '@/design-system';
import { VisualCard } from '@/engines/visual';
import {
  PATTERN_FAMILIES,
  PATTERN_LIBRARY,
  glyphToVisualSpec,
  type Direction,
} from '@/data';

type Filter = 'all' | Direction;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'bullish', label: 'Haussières' },
  { id: 'bearish', label: 'Baissières' },
  { id: 'neutral', label: 'Neutres' },
];

/**
 * Bibliothèque visuelle — galerie de toutes les figures illustrées en code (SVG déterministe,
 * accessible). Un « signal visuel » par figure, groupé par famille, filtrable par direction.
 * Aucune image externe : chaque schéma est généré par le moteur de visuels.
 */
export default function BibliothequeVisuelle() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? PATTERN_LIBRARY : PATTERN_LIBRARY.filter((g) => g.direction === filter)),
    [filter],
  );

  return (
    <Screen>
      <Text variant="h1">Bibliothèque visuelle</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {PATTERN_LIBRARY.length} figures dessinées en code — chandeliers, structure et figures.
        Chaque schéma est original et accessible (résumé textuel inclus).
      </Text>

      <View style={styles.filters} accessibilityRole="tablist">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityHint={`Filtrer : ${f.label.toLowerCase()}`}
              onPress={() => setFilter(f.id)}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text
                variant="caption"
                color={active ? theme.colors.backgroundDeep : theme.colors.textSecondary}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {PATTERN_FAMILIES.map((fam) => {
        const glyphs = visible.filter((g) => g.family === fam.id);
        if (!glyphs.length) return null;
        return (
          <View key={fam.id} style={styles.section}>
            <Text variant="h2">{fam.title}</Text>
            <Text variant="caption" color={theme.colors.textMuted}>
              {fam.subtitle}
            </Text>
            {glyphs.map((g) => (
              <VisualCard key={g.id} spec={glyphToVisualSpec(g)} title={`${g.title} · ${g.aliasEn}`} />
            ))}
          </View>
        );
      })}

      <Button label="Retour" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, marginBottom: theme.spacing.sm },
  pill: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  pillActive: { backgroundColor: theme.colors.technical, borderColor: theme.colors.technical },
  section: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
});
