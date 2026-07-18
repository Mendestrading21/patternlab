import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, Flashcard, EmptyState, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { PatternChart, generateCandles } from '@/engines/pattern';
import { allLessons } from '@/data';
import type { LessonStep, LessonStepKind } from '@/engines/learning';
import { analytics } from '@/analytics';

type Meta = { label: string; color: string; accent?: string };

const STEP_META: Record<LessonStepKind, Meta> = {
  intro: { label: '✨ Pour commencer', color: theme.colors.primaryBright },
  explain: { label: 'Explication', color: theme.colors.textMuted },
  observe: { label: '👀 Observe', color: theme.colors.technical },
  example: { label: 'Exemple', color: theme.colors.textMuted },
  chart: { label: '📈 Graphique', color: theme.colors.technical },
  interaction: { label: 'À toi', color: theme.colors.primary },
  warning: { label: '⚠️ Attention', color: theme.colors.warning, accent: theme.colors.warning },
  falseSignal: { label: '🚩 Faux signal / limite', color: theme.colors.bearish, accent: theme.colors.bearish },
  summary: { label: '🎯 À retenir', color: theme.colors.primary, accent: theme.colors.primary },
  flashcard: { label: '', color: '' },
};

function StepView({ step }: { step: LessonStep }) {
  if (step.kind === 'flashcard' && step.flashcard) {
    return <Flashcard front={step.flashcard.front} back={step.flashcard.back} />;
  }

  if (step.kind === 'chart') {
    return (
      <Card>
        <Text variant="label" color={theme.colors.technical}>
          {STEP_META.chart.label}
        </Text>
        <View style={styles.chart}>
          <PatternChart candles={generateCandles(step.chartSeed ?? 1, 30)} width={300} height={150} />
        </View>
        {step.body ? (
          <Text variant="body" color={theme.colors.textSecondary}>
            {step.body}
          </Text>
        ) : null}
      </Card>
    );
  }

  const meta = STEP_META[step.kind] ?? { label: step.kind, color: theme.colors.textMuted };
  const elevated = step.kind === 'intro';
  return (
    <Card elevated={elevated} style={meta.accent ? { borderColor: meta.accent } : undefined}>
      <Text variant="label" color={meta.color}>
        {meta.label}
      </Text>
      {step.body ? <Text variant="body">{step.body}</Text> : null}
    </Card>
  );
}

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
        <StepView key={step.id} step={step} />
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
  metaRow: { flexDirection: 'row', gap: theme.spacing.sm },
  chart: { alignItems: 'center', marginVertical: theme.spacing.md },
  mistake: { borderColor: theme.colors.warning },
  actions: { gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
});
