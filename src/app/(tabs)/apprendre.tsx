import { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { View, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import {
  Screen,
  Text,
  Card,
  SegmentedControl,
  FavoriteButton,
  TrademyIcon,
  theme,
  hitSlopFor,
  type SegmentOption,
  type TrademyIconName,
} from '@/design-system';
import {
  V5_CONCEPTS,
  CATEGORIES,
  browseConcepts,
  conceptFamilies,
  difficultyLabel,
  conceptMasteryStatus,
  useProgress,
  type LearningConcept,
  type ConceptStatusLabel,
} from '@/data';
import { analytics } from '@/analytics';

/**
 * Espace « Bibliothèque » (canon Trademy) — la référence cherchable : recherche rapide, filtres
 * par famille et statut de maîtrise, favoris et récents, fiches pédagogiques. Conçu pour croître
 * vers 500+ concepts. Les outils de référence (glossaire, figures, quiz, leçons) restent accessibles.
 */
type Collection = 'all' | 'favorites' | 'recent';
type StatusFilter = 'all' | ConceptStatusLabel;

const TOOLS: { icon: TrademyIconName; label: string; route: Href }[] = [
  { icon: 'book', label: 'Glossaire', route: '/glossaire' },
  { icon: 'chart', label: 'Figures', route: '/bibliotheque-visuelle' },
  { icon: 'search', label: 'Quiz visuel', route: '/reconnaissance' },
  { icon: 'play', label: 'Leçons', route: '/lecons' },
  { icon: 'target', label: 'Quiz éclair', route: '/quiz' },
];

const STATUS_COLORS: Record<ConceptStatusLabel, string> = {
  Nouveau: theme.colors.textMuted,
  Découvert: theme.colors.technical,
  Maîtrisé: theme.colors.reward,
};

export default function Bibliotheque() {
  const router = useRouter();
  const { favorites, recentSlugs, toggleFavorite, state } = useProgress();
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<Collection>('all');
  const [categoryId, setCategoryId] = useState<string | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const exploredSlugs = state?.learning?.conceptsExplored ?? [];
  const skills = state?.skills ?? {};
  const statusOf = (c: LearningConcept): ConceptStatusLabel =>
    conceptMasteryStatus(c, { exploredSlugs, skills }).label;

  const families = conceptFamilies(V5_CONCEPTS, CATEGORIES);

  let base = V5_CONCEPTS;
  if (collection === 'favorites') {
    base = base.filter((c) => favorites.has(c.slug));
  } else if (collection === 'recent') {
    const order = new Map(recentSlugs.map((s, i) => [s, i]));
    base = base.filter((c) => order.has(c.slug)).sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  }
  let list = browseConcepts(base, { query, categoryId: categoryId === 'all' ? null : categoryId });
  if (status !== 'all') list = list.filter((c) => statusOf(c) === status);

  const collections: SegmentOption<Collection>[] = [
    { id: 'all', label: 'Tous' },
    { id: 'favorites', label: '★ Favoris', badge: favorites.size },
    { id: 'recent', label: 'Récents', badge: recentSlugs.length },
  ];
  const statuses: StatusFilter[] = ['all', 'Nouveau', 'Découvert', 'Maîtrisé'];

  return (
    <Screen>
      <Text variant="h1">Bibliothèque</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Cherche, filtre et révise les concepts. Chaque fiche explique, illustre et met en garde.
      </Text>

      {/* Outils de référence — toujours accessibles */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tools}>
        {TOOLS.map((t) => (
          <Pressable
            key={t.label}
            accessibilityRole="button"
            accessibilityHint={`Ouvrir : ${t.label}`}
            onPress={() => router.push(t.route)}
            style={styles.tool}
          >
            <TrademyIcon name={t.icon} size={18} color={theme.colors.primaryBright} />
            <Text variant="label" color={theme.colors.textSecondary}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => analytics.track('library_searched', { queryLength: query.trim().length, results: list.length })}
        placeholder="Rechercher un concept…"
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel="Rechercher un concept"
      />

      <SegmentedControl options={collections} value={collection} onChange={setCollection} accessibilityLabel="Collection" />

      {/* Filtre par famille */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        <FilterPill label="Toutes" active={categoryId === 'all'} onPress={() => setCategoryId('all')} />
        {families.map((f) => (
          <FilterPill key={f.id} label={`${f.label} · ${f.count}`} active={categoryId === f.id} onPress={() => setCategoryId(f.id)} />
        ))}
      </ScrollView>

      {/* Filtre par statut de maîtrise */}
      <View style={styles.chipsWrap}>
        {statuses.map((s) => (
          <FilterPill
            key={s}
            label={s === 'all' ? 'Tout statut' : s}
            color={s !== 'all' ? STATUS_COLORS[s] : undefined}
            active={status === s}
            onPress={() => setStatus(s)}
          />
        ))}
      </View>

      <Text variant="caption" color={theme.colors.textMuted}>
        {list.length} concept{list.length > 1 ? 's' : ''} sur {V5_CONCEPTS.length}
      </Text>

      {list.map((c) => {
        const cat = CATEGORIES.find((x) => x.id === c.categoryId);
        const st = statusOf(c);
        return (
          <Card key={c.slug}>
            <View style={styles.top}>
              <Pressable
                style={styles.flex1}
                accessibilityRole="button"
                accessibilityHint={`Ouvrir la fiche ${c.title}`}
                onPress={() => router.push(`/concept/${c.slug}`)}
              >
                <Text variant="title">{c.title}</Text>
                <Text variant="caption" color={theme.colors.textMuted}>
                  {cat?.label} · {difficultyLabel(c.difficulty)}
                  {c.estimatedMinutes ? ` · ${c.estimatedMinutes} min` : ''}
                </Text>
                <Text variant="body" color={theme.colors.textSecondary} style={styles.summary}>
                  {c.definitionShort}
                </Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[st] }]} />
                  <Text variant="caption" color={STATUS_COLORS[st]}>
                    {st}
                  </Text>
                </View>
              </Pressable>
              <FavoriteButton active={favorites.has(c.slug)} onToggle={() => toggleFavorite(c.slug)} label={c.title} />
            </View>
          </Card>
        );
      })}

      {list.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted} center>
          {collection === 'favorites'
            ? 'Aucun favori pour l’instant. Touche ★ sur une fiche pour l’enregistrer.'
            : collection === 'recent'
              ? 'Aucun concept consulté récemment.'
              : `Aucun concept ne correspond à ces filtres.`}
        </Text>
      ) : null}
    </Screen>
  );
}

function FilterPill({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  const accent = color ?? theme.colors.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      hitSlop={hitSlopFor(24)}
      style={[styles.pill, active && { backgroundColor: accent, borderColor: accent }]}
    >
      <Text variant="label" color={active ? theme.colors.onPrimary : theme.colors.textSecondary}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tools: { gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceElevated,
  },
  search: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  chipsRow: { gap: theme.spacing.xs, paddingVertical: 2 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing.sm },
  flex1: { flex: 1, gap: 2 },
  summary: { marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: theme.spacing.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});
