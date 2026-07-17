import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Text, Card, Button, EmptyState, theme } from '@/design-system';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from '@/data';

export default function GlossaryDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);

  if (!term) {
    return (
      <Screen>
        <EmptyState icon="🔎" title="Terme introuvable" message="Ce terme n’est pas dans l’aperçu du glossaire." />
        <Button label="Retour au glossaire" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const c = GLOSSARY_CATEGORIES.find((x) => x.id === term.category);

  return (
    <Screen>
      <Text variant="caption" color={c?.color}>
        {c?.label?.toUpperCase()}
      </Text>
      <Text variant="h1">{term.term}</Text>
      <Text variant="body" color={theme.colors.textMuted} style={{ fontStyle: 'italic' }}>
        {term.english}
      </Text>

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

      <Button label="Retour au glossaire" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
