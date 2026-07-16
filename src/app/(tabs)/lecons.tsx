import { useRouter } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Chip, theme } from '@/design-system';
import { PatternChart, generateCandles } from '@/engines/pattern';
import { DEMO_LESSONS, DEMO_PATTERN } from '@/data';

export default function Lecons() {
  const router = useRouter();
  const candles = generateCandles(2024, 30);

  return (
    <Screen>
      <Text variant="h1">Leçons 📚</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Module pilote : « Lire un graphique ».
      </Text>

      {DEMO_LESSONS.map((lesson) => (
        <Pressable
          key={lesson.id}
          accessibilityRole="button"
          accessibilityHint="Ouvrir la leçon"
          onPress={() => router.push(`/lesson/${lesson.id}`)}
        >
          <Card>
            <Text variant="title">{lesson.title}</Text>
            <Text variant="body" color={theme.colors.textSecondary}>
              {lesson.objective}
            </Text>
            <View style={styles.meta}>
              <Chip label={`${lesson.estimatedMinutes ?? 5} min`} />
              <Chip label={lesson.difficulty ?? 'débutant'} color={theme.colors.primary} />
            </View>
          </Card>
        </Pressable>
      ))}

      <Text variant="h2">Aperçu du Laboratoire 🧪</Text>
      <Card>
        <Text variant="title">{DEMO_PATTERN.name}</Text>
        <Text variant="caption" color={theme.colors.textMuted}>
          Figure {DEMO_PATTERN.direction === 'bullish' ? 'haussière' : 'baissière'} · données de démonstration
        </Text>
        <View style={styles.chart}>
          <PatternChart candles={candles} width={300} height={160} />
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          {DEMO_PATTERN.definition}
        </Text>
        <Text variant="caption" color={theme.colors.textMuted}>
          Interactions (tracer, comparer, invalidation) : arrivent en P0.3 / P1.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  chart: { alignItems: 'center', marginVertical: theme.spacing.md },
});
