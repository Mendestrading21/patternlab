import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, EmptyState, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { DEMO_LESSONS } from '@/data';
import { analytics } from '@/analytics';

const STEP_LABEL: Record<string, string> = {
  explain: 'Explication',
  example: 'Exemple',
  interaction: 'À toi',
  summary: 'À retenir',
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lesson = DEMO_LESSONS.find((l) => l.id === id);

  useEffect(() => {
    if (lesson) analytics.track('lesson_started', { lessonId: lesson.id });
  }, [lesson]);

  if (!lesson) {
    return (
      <Screen>
        <EmptyState
          icon="🔒"
          title="Étape à débloquer"
          message="Cette étape arrivera dans le parcours pilote (P0.3). Termine d’abord les leçons disponibles."
        />
        <Button label="Retour" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const finish = () => {
    analytics.track('lesson_completed', { lessonId: lesson.id });
    router.push(`/session/${lesson.skillId}`);
  };

  return (
    <Screen>
      <Text variant="caption" color={theme.colors.primary}>
        LEÇON
      </Text>
      <Text variant="h1">{lesson.title}</Text>
      {lesson.objective ? (
        <Text variant="body" color={theme.colors.textSecondary}>
          {lesson.objective}
        </Text>
      ) : null}

      <CharacterScene character="toto" state="explain" size={72} speech="On y va pas à pas, tu vas voir." />

      {lesson.steps.map((step) => (
        <Card key={step.id}>
          <Text variant="label" color={theme.colors.textMuted}>
            {STEP_LABEL[step.kind] ?? step.kind}
          </Text>
          <Text variant="body">{step.body}</Text>
        </Card>
      ))}

      {lesson.commonMistake ? (
        <Card style={styles.mistake}>
          <Text variant="label" color={theme.colors.warning}>
            ⚠️ Erreur fréquente
          </Text>
          <Text variant="body">{lesson.commonMistake}</Text>
        </Card>
      ) : null}

      {lesson.sources?.length ? (
        <Text variant="caption" color={theme.colors.textMuted}>
          Source : {lesson.sources.join(', ')}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button label="Terminer la leçon" onPress={finish} accessibilityHint="Passer aux exercices" />
        <Button label="Retour" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mistake: { borderColor: theme.colors.warning },
  actions: { gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
});
