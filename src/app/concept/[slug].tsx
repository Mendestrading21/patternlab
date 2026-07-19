import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, EmptyState, theme, hitSlopFor } from '@/design-system';
import {
  V5_CONCEPTS,
  conceptBySlug,
  relatedConcepts,
  worldById,
  categoryById,
  useProgress,
} from '@/data';
import { VisualCard } from '@/engines/visual';
import { analytics } from '@/analytics';

export default function ConceptFiche() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { favorites, toggleFavorite, markRecentlyViewed } = useProgress();
  const concept = conceptBySlug(V5_CONCEPTS, slug ?? '');
  const fav = concept ? favorites.has(concept.slug) : false;

  useEffect(() => {
    if (concept) {
      analytics.track('concept_viewed', { categoryId: concept.categoryId, hasVisual: Boolean(concept.visualSpec) });
      markRecentlyViewed(concept.slug);
    }
  }, [concept, markRecentlyViewed]);

  if (!concept) {
    return (
      <Screen>
        <EmptyState icon="🔎" title="Concept introuvable" message="Ce concept n’est pas dans l’aperçu V5." />
        <Button label="Retour" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const world = worldById(concept.worldId);
  const category = categoryById(concept.categoryId);
  const related = relatedConcepts(V5_CONCEPTS, concept);
  const scenarios = [
    { label: 'Scénario haussier', data: concept.bullishScenario, color: theme.colors.bullish },
    { label: 'Scénario baissier', data: concept.bearishScenario, color: theme.colors.bearish },
    { label: 'Scénario neutre', data: concept.neutralScenario, color: theme.colors.neutral },
  ].filter((s) => s.data);

  return (
    <Screen>
      <Text variant="caption" color={theme.colors.technical}>
        {world?.title?.toUpperCase()} · {category?.label}
      </Text>
      <View style={styles.headRow}>
        <Text variant="h1" style={styles.flex1}>
          {concept.title}
        </Text>
        <Pressable
          onPress={() => toggleFavorite(concept.slug)}
          hitSlop={hitSlopFor(28)}
          accessibilityRole="button"
          accessibilityLabel={fav ? `Retirer ${concept.title} des favoris` : `Ajouter ${concept.title} aux favoris`}
          accessibilityState={{ selected: fav }}
        >
          <Text variant="h1" color={fav ? theme.colors.reward : theme.colors.textMuted}>
            {fav ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.metaRow}>
        <Chip label={`Difficulté ${concept.difficulty}/5`} color={theme.colors.neutral} />
        {concept.aliases[0] ? <Chip label={concept.aliases[0]} color={theme.colors.textMuted} /> : null}
      </View>

      {concept.visualSpec ? <VisualCard spec={concept.visualSpec} title="Visuel" /> : null}

      <Card elevated>
        <Text variant="label" color={theme.colors.textMuted}>
          En bref
        </Text>
        <Text variant="body">{concept.definitionShort}</Text>
      </Card>

      <Card>
        <Text variant="label" color={theme.colors.textMuted}>
          Définition
        </Text>
        <Text variant="body">{concept.definitionDetailed}</Text>
      </Card>

      {concept.howToRecognize.length ? (
        <Card>
          <Text variant="title">Comment reconnaître</Text>
          <View style={styles.list}>
            {concept.howToRecognize.map((r) => (
              <Text key={r} variant="body" color={theme.colors.textSecondary}>
                • {r}
              </Text>
            ))}
          </View>
        </Card>
      ) : null}

      {scenarios.map((s) => (
        <Card key={s.label}>
          <Text variant="title" color={s.color}>
            {s.label}
          </Text>
          <View style={styles.list}>
            {s.data!.conditions.map((c) => (
              <Text key={c} variant="body" color={theme.colors.textSecondary}>
                • {c}
              </Text>
            ))}
          </View>
          <Text variant="caption" color={theme.colors.warning}>
            Invalidation : {s.data!.invalidation}
          </Text>
        </Card>
      ))}

      {concept.falseSignals.length ? (
        <Card>
          <Text variant="title" color={theme.colors.bearish}>
            Faux signaux
          </Text>
          <View style={styles.list}>
            {concept.falseSignals.map((f) => (
              <Text key={f} variant="body" color={theme.colors.textSecondary}>
                • {f}
              </Text>
            ))}
          </View>
        </Card>
      ) : null}

      {concept.flashcards[0] ? (
        <Card>
          <Text variant="label" color={theme.colors.primary}>
            Flashcard
          </Text>
          <Text variant="body">{concept.flashcards[0].front}</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {concept.flashcards[0].back}
          </Text>
        </Card>
      ) : null}

      {related.length ? (
        <Card>
          <Text variant="title">Concepts liés</Text>
          <View style={styles.chips}>
            {related.map((rc) => (
              <Pressable
                key={rc.id}
                accessibilityRole="button"
                accessibilityHint={`Ouvrir ${rc.title}`}
                onPress={() => router.push(`/concept/${rc.slug}`)}
                style={styles.relatedChip}
              >
                <Text variant="caption" color={theme.colors.technical}>
                  {rc.title} ›
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      ) : null}

      <Text variant="caption" color={theme.colors.textMuted} center>
        {concept.disclaimer}
      </Text>
      <Button label="Retour" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  list: { gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  relatedChip: {
    borderWidth: 1,
    borderColor: theme.colors.technical,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
});
