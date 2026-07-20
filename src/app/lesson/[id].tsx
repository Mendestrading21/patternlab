import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, Flashcard, EmptyState, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { PatternChart, generateCandles } from '@/engines/pattern';
import { VisualCard } from '@/engines/visual';
import { allLessons, conceptBySlug, V5_CONCEPTS } from '@/data';
import type { LessonStep, LessonStepKind } from '@/engines/learning';
import { analytics } from '@/analytics';

type Meta = { label: string; color: string; accent?: string };

const STEP_META: Record<LessonStepKind, Meta> = {
  intro: { label: '✨ Pour commencer', color: theme.colors.primaryBright },
  explain: { label: 'Explication', color: theme.colors.textMuted },
  observe: { label: '👀 Observe', color: theme.colors.technical },
  example: { label: 'Exemple', color: theme.colors.textMuted },
  chart: { label: '📈 Graphique', color: theme.colors.technical },
  visual: { label: '🕯️ Le visuel', color: theme.colors.technical },
  hypothesis: { label: '⚖️ Hypothèse — Toto / Bobo', color: theme.colors.advanced, accent: theme.colors.advanced },
  interaction: { label: 'À toi', color: theme.colors.primary },
  warning: { label: '⚠️ Attention', color: theme.colors.warning, accent: theme.colors.warning },
  falseSignal: { label: '🚩 Faux signal / limite', color: theme.colors.bearish, accent: theme.colors.bearish },
  summary: { label: '🎯 À retenir', color: theme.colors.primary, accent: theme.colors.primary },
  flashcard: { label: '', color: '' },
};

function StepView({ step }: { step: LessonStep }) {
  const router = useRouter();

  if (step.kind === 'flashcard' && step.flashcard) {
    return <Flashcard front={step.flashcard.front} back={step.flashcard.back} />;
  }

  if (step.kind === 'visual') {
    const concept = step.conceptRef ? conceptBySlug(V5_CONCEPTS, step.conceptRef) : undefined;
    if (concept?.visualSpec) {
      return (
        <View style={styles.stepStack}>
          <VisualCard spec={concept.visualSpec} title={STEP_META.visual.label} />
          {concept.howToRecognize.length ? (
            <Card>
              <Text variant="label" color={theme.colors.textMuted}>
                Comment reconnaître
              </Text>
              {concept.howToRecognize.slice(0, 3).map((r) => (
                <Text key={r} variant="body" color={theme.colors.textSecondary}>
                  • {r}
                </Text>
              ))}
            </Card>
          ) : null}
          <Button
            label="Voir la fiche complète →"
            variant="secondary"
            onPress={() => router.push(`/concept/${concept.slug}`)}
            accessibilityHint={`Ouvrir la fiche ${concept.title}`}
          />
        </View>
      );
    }
    return (
      <Card>
        <Text variant="label" color={theme.colors.technical}>
          {STEP_META.visual.label}
        </Text>
        {step.body ? <Text variant="body">{step.body}</Text> : null}
      </Card>
    );
  }

  if (step.kind === 'hypothesis') {
    const concept = step.conceptRef ? conceptBySlug(V5_CONCEPTS, step.conceptRef) : undefined;
    const bull = concept?.bullishScenario?.conditions?.[0];
    const bear = concept?.bearishScenario?.conditions?.[0] ?? concept?.falseSignals?.[0];
    return (
      <Card style={styles.hypothesis}>
        <Text variant="label" color={theme.colors.advanced}>
          {STEP_META.hypothesis.label}
        </Text>
        {step.body ? (
          <Text variant="body" color={theme.colors.textSecondary}>
            {step.body}
          </Text>
        ) : null}
        <View style={styles.debate}>
          <CharacterScene
            character="toto"
            state="observe"
            size={56}
            speech={bull ? `Hypothèse haussière : ${bull}` : 'Toto formule une hypothèse haussière conditionnelle.'}
          />
          <CharacterScene
            character="bobo"
            state="false-signal"
            size={56}
            reversed
            speech={bear ? `Le risque : ${bear}` : 'Bobo cherche ce qui invaliderait le scénario.'}
          />
        </View>
      </Card>
    );
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
  chart: { alignItems: 'center', marginVertical: theme.spacing.md },
  stepStack: { gap: theme.spacing.sm },
  hypothesis: { borderColor: theme.colors.advanced },
  debate: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  mistake: { borderColor: theme.colors.warning },
  actions: { gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
});
