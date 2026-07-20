import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, EmptyState, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { allLessons } from '@/data';
import { LessonStepView } from '@/components/LessonStepView';
import { analytics } from '@/analytics';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lesson = allLessons().find((l) => l.id === id);

  useEffect(() => {
    if (lesson) analytics.track('lesson_started', { lessonId: lesson.id });
  }, [lesson]);

  if (!lesson) {
    return (
      <Screen>
        <EmptyState
          icon="🔒"
          title="Étape à débloquer"
          message="Cette étape arrivera plus tard dans le parcours. Termine d’abord les leçons disponibles."
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
      {lesson.estimatedMinutes ? (
        <View style={styles.metaRow}>
          <Chip icon="⏱️" label={`${lesson.estimatedMinutes} min`} color={theme.colors.technical} />
          {lesson.difficulty ? <Chip label={lesson.difficulty} color={theme.colors.neutral} /> : null}
        </View>
      ) : null}

      <CharacterScene character="toto" state="explain" size={64} speech="On y va pas à pas, tu vas voir." />

      {lesson.steps.map((step) => (
        <LessonStepView key={step.id} step={step} />
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
        <Text variant="caption" color={theme.colors.textMuted} center>
          Prochaine étape : les exercices consolident, puis la révision espacée revient au bon moment.
        </Text>
        <Button label="Terminer la leçon" onPress={finish} accessibilityHint="Passer aux exercices" />
        <Button label="Retour" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', gap: theme.spacing.sm },
  mistake: { borderColor: theme.colors.warning },
  actions: { gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
});
