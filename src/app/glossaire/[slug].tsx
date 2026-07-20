import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, EmptyState, FavoriteButton, theme, hitSlopFor } from '@/design-system';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, skillById, useProgress } from '@/data';
import { analytics } from '@/analytics';

export default function GlossaryDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { favorites, toggleFavorite, markRecentlyViewed, markConceptExplored, ready } = useProgress();
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);
  const fav = term ? favorites.has(term.slug) : false;

  useEffect(() => {
    if (term) analytics.track('concept_viewed', { category: term.category, hasRelatedSkill: Boolean(term.relatedSkillId) });
  }, [term]);

  useEffect(() => {
    if (ready && term) {
      markRecentlyViewed(term.slug);
      markConceptExplored(term.slug);
    }
  }, [ready, term, markRecentlyViewed, markConceptExplored]);

  if (!term) {
    return (
      <Screen>
        <EmptyState icon="🔎" title="Terme introuvable" message="Ce terme n’est pas dans l’aperçu du glossaire." />
        <Button label="Retour au glossaire" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const c = GLOSSARY_CATEGORIES.find((x) => x.id === term.category);
  const relatedSkill = term.relatedSkillId ? skillById(term.relatedSkillId) : undefined;
  const relatedTerms = (term.related ?? [])
    .map((s) => GLOSSARY_TERMS.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Screen>
      <View style={styles.headRow}>
        <View style={styles.flex1}>
          <Text variant="caption" color={c?.color}>
            {c?.label?.toUpperCase()}
          </Text>
          <Text variant="h1">{term.term}</Text>
          <Text variant="body" color={theme.colors.textMuted} style={styles.italic}>
            {term.english}
          </Text>
        </View>
        <FavoriteButton active={fav} onToggle={() => toggleFavorite(term.slug)} label={term.term} size="lg" />
      </View>

      <Card elevated>
        <Text variant="label" color={theme.colors.textMuted}>
          En bref
        </Text>
        <Text variant="body">{term.summary}</Text>
      </Card>

      <Card>
        <Text variant="label" color={theme.colors.textMuted}>
          Définition
        </Text>
        <Text variant="body">{term.definition}</Text>
      </Card>

      {term.example ? (
        <Card>
          <Text variant="label" color={theme.colors.primary}>
            Exemple concret
          </Text>
          <Text variant="body">{term.example}</Text>
        </Card>
      ) : null}

      {relatedSkill ? (
        <Button
          label={`S’entraîner — ${relatedSkill.name}`}
          onPress={() => router.push(`/session/${relatedSkill.id}`)}
          accessibilityHint="Lancer une session sur la compétence liée"
        />
      ) : null}

      {relatedTerms.length ? (
        <Card>
          <Text variant="label" color={theme.colors.textMuted}>
            Termes reliés
          </Text>
          <View style={styles.relatedRow}>
            {relatedTerms.map((rt) => (
              <Pressable
                key={rt.slug}
                accessibilityRole="button"
                accessibilityHint={`Ouvrir ${rt.term}`}
                onPress={() => router.push(`/glossaire/${rt.slug}`)}
                hitSlop={hitSlopFor(32)}
                style={styles.relatedChip}
              >
                <Text variant="caption" color={theme.colors.technical}>
                  {rt.term} ›
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      ) : null}

      <Button label="Retour au glossaire" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  italic: { fontStyle: 'italic' },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  relatedChip: {
    borderWidth: 1,
    borderColor: theme.colors.technical,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
});
