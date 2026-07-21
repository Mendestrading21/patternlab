import { useMemo, useState } from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Button, theme } from '@/design-system';
import { VisualCard } from '@/engines/visual';
import {
  PATTERN_FAMILIES,
  PATTERN_LIBRARY,
  glyphToVisualSpec,
  searchFigures,
  type Direction,
  type VisualSpec,
} from '@/data';

type Filter = 'all' | Direction;

/** Vitrine des formats visuels avancés (volume, comparaisons, aide-mémoire) — hors familles de figures. */
const SHOWCASE: { title: string; spec: VisualSpec }[] = [
  {
    title: 'Profil de volume · range',
    spec: {
      type: 'volume-profile',
      variant: 'range',
      direction: 'neutral',
      labels: [],
      annotations: [],
      datasetKey: 'structure.support-resistance.v1',
      accessibilitySummary: 'Profil de volume : le volume se concentre autour d’un palier de prix central (POC).',
    },
  },
  {
    title: 'Comparaison · haussière vs baissière',
    spec: {
      type: 'comparison',
      variant: 'bull-vs-bear',
      direction: 'neutral',
      labels: [],
      annotations: [],
      accessibilitySummary:
        'Comparaison : une bougie haussière verte (clôture au-dessus de l’ouverture) face à une bougie baissière rouge.',
    },
  },
  {
    title: 'Comparaison · tendance vs range',
    spec: {
      type: 'comparison',
      variant: 'trend-vs-range',
      direction: 'neutral',
      labels: [],
      annotations: [],
      accessibilitySummary: 'Comparaison : une structure en tendance face à une structure en range (latérale).',
    },
  },
  {
    title: 'Aide-mémoire · bougies',
    spec: {
      type: 'cheat-sheet',
      variant: 'candles',
      direction: 'neutral',
      labels: [],
      annotations: [],
      accessibilitySummary: 'Aide-mémoire des bougies : verte, rouge, doji, marteau.',
    },
  },
  {
    title: 'Aide-mémoire · retournements',
    spec: {
      type: 'cheat-sheet',
      variant: 'reversals',
      direction: 'neutral',
      labels: [],
      annotations: [],
      accessibilitySummary:
        'Aide-mémoire des figures de retournement : marteau, étoile filante, avalement haussier, étoile du soir.',
    },
  },
];

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
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const byDir = filter === 'all' ? PATTERN_LIBRARY : PATTERN_LIBRARY.filter((g) => g.direction === filter);
    return searchFigures(query, byDir);
  }, [filter, query]);

  return (
    <Screen>
      <Text variant="h1">Bibliothèque visuelle</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {PATTERN_LIBRARY.length} figures dessinées en code — chandeliers, structure et figures.
        Chaque schéma est original et accessible (résumé textuel inclus).
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Rechercher une figure (marteau, triangle, RSI…)"
        placeholderTextColor={theme.colors.textMuted}
        value={query}
        onChangeText={setQuery}
        accessibilityLabel="Rechercher une figure par nom ou famille"
        autoCapitalize="none"
        autoCorrect={false}
      />

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

      {visible.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted}>
          Aucune figure ne correspond à « {query} ».
        </Text>
      ) : (
        <Text variant="caption" color={theme.colors.textMuted}>
          {visible.length} figure{visible.length > 1 ? 's' : ''} affichée{visible.length > 1 ? 's' : ''}
        </Text>
      )}

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

      <View style={styles.section}>
        <Text variant="h2">Volume, comparaisons & aide-mémoire</Text>
        <Text variant="caption" color={theme.colors.textMuted}>
          De nouveaux formats visuels, tous générés en code et accessibles.
        </Text>
        {SHOWCASE.map((s) => (
          <VisualCard key={s.title} spec={s.spec} title={s.title} />
        ))}
      </View>

      <Button label="Retour" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
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
