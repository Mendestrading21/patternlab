import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, theme } from '@/design-system';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, searchGlossary, type GlossaryCategory } from '@/data';

export default function Glossaire() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<GlossaryCategory | 'all'>('all');

  const list = searchGlossary(GLOSSARY_TERMS, query, cat);

  return (
    <Screen>
      <Text variant="h1">Glossaire 📖</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Le vocabulaire des marchés, expliqué simplement.
      </Text>

      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un terme…"
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel="Rechercher un terme"
      />

      <View style={styles.chips}>
        {GLOSSARY_CATEGORIES.map((c) => {
          const active = cat === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => setCat(c.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
            >
              <Text variant="label" color={active ? theme.colors.onPrimary : theme.colors.textSecondary}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="caption" color={theme.colors.textMuted}>
        {list.length} terme{list.length > 1 ? 's' : ''} sur {GLOSSARY_TERMS.length} · le vocabulaire essentiel des marchés
      </Text>

      {list.map((t) => {
        const c = GLOSSARY_CATEGORIES.find((x) => x.id === t.category);
        return (
          <Pressable key={t.slug} accessibilityRole="button" onPress={() => router.push(`/glossaire/${t.slug}`)}>
            <Card>
              <View style={styles.top}>
                <View style={styles.termHead}>
                  <Text variant="title">{t.term}</Text>
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {t.english}
                  </Text>
                </View>
                <View style={[styles.tag, { borderColor: c?.color ?? theme.colors.border }]}>
                  <Text variant="caption" color={c?.color}>
                    {c?.label}
                  </Text>
                </View>
              </View>
              <Text variant="body" color={theme.colors.textSecondary}>
                {t.summary}
              </Text>
            </Card>
          </Pressable>
        );
      })}
      {list.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted} center>
          Aucun terme ne correspond à « {query} ».
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing.sm },
  termHead: { flex: 1, gap: 1 },
  tag: { borderWidth: 1, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.sm, paddingVertical: 2 },
});
