import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, ProgressBar, FeedbackPanel, theme } from '@/design-system';
import { CharacterScene, MascotFigure } from '@/characters';
import { ExercisePlayer, gradeExercise, type GradeResult } from '@/engines/exercise';
import { getExercises, getLessons, skillById, limitCount, isCheckpoint, isFalseSignalExercise, useProgress, buildSessionSummary } from '@/data';
import { xpForGrade } from '@/engines/learning';
import { LessonStepView } from '@/components/LessonStepView';
import { analytics } from '@/analytics';

/** Seuil de réussite d'une session (déblocage de la compétence). */
const PASS_RATIO = 0.7;

export default function Session() {
  const { skillId, count } = useLocalSearchParams<{ skillId: string; count?: string }>();
  const router = useRouter();
  const { recordAnswer, completeSession, recordFalseSignal } = useProgress();

  const resolvedId = skillId && getExercises(skillId).length ? skillId : 'skill.actions';
  const all = getExercises(resolvedId);
  // `count` (facultatif) provient de la mission du jour : longueur modulée par le temps quotidien.
  const target = count != null ? Number.parseInt(count, 10) : null;
  const list = all.slice(0, limitCount(all.length, target));
  const skillName = skillById(resolvedId)?.name ?? 'Session';
  // Leçons de la compétence : la phase « Apprendre » les montre AVANT les exercices,
  // pour que le nouvel utilisateur voie tout de suite le visuel (bougies, graphique).
  const lessons = getLessons(resolvedId);

  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [correct, setCorrect] = useState(0);
  // Un point de contrôle (`getLessons` vide) démarre directement en « practice ».
  const [phase, setPhase] = useState<'learn' | 'practice'>(lessons.length ? 'learn' : 'practice');

  const finished = index >= list.length;

  if (phase === 'learn') {
    const primary = lessons[0];
    return (
      <Screen>
        <Text variant="caption" color={theme.colors.primary}>
          APPRENDRE
        </Text>
        <Text variant="h2">{skillName}</Text>
        <CharacterScene
          character="toto"
          state="explain"
          size={60}
          speech="On regarde d’abord, puis on s’exerce."
        />
        {primary.steps.map((step) => (
          <LessonStepView key={step.id} step={step} />
        ))}
        {lessons.length > 1 ? (
          <Card>
            <Text variant="label" color={theme.colors.textMuted}>
              Pour aller plus loin
            </Text>
            {lessons.slice(1).map((l) => (
              <Button
                key={l.id}
                label={`${l.title} →`}
                variant="ghost"
                onPress={() => router.push(`/lesson/${l.id}`)}
                accessibilityHint={`Ouvrir la leçon ${l.title}`}
              />
            ))}
          </Card>
        ) : null}
        <Button
          label="Commencer les exercices"
          onPress={() => {
            analytics.track('lesson_started', { skillId: resolvedId });
            setPhase('practice');
          }}
        />
      </Screen>
    );
  }

  if (finished) {
    return (
      <Results
        total={list.length}
        correct={correct}
        onComplete={(passed) => {
          completeSession(resolvedId, passed);
          if (isCheckpoint(resolvedId)) analytics.track('checkpoint_completed', { passed });
        }}
        onHome={() => router.replace('/(tabs)')}
        onRetry={() => {
          setIndex(0);
          setResult(null);
          setCorrect(0);
        }}
      />
    );
  }

  const exercise = list[index];

  const validate = (answer: unknown) => {
    if (result) return;
    const graded = gradeExercise(exercise, answer);
    setResult(graded);
    if (graded.correct) setCorrect((c) => c + 1);
    // Erreur → errorTag = id de l'exercice (concept à retravailler ; révision rapprochée).
    recordAnswer(exercise.skillId, graded.correct ? 5 : 2, graded.correct ? undefined : exercise.id);
    // Réussite « compréhension » V5 : un faux signal / une invalidation correctement repéré.
    if (graded.correct && isFalseSignalExercise(exercise.type)) recordFalseSignal();
    analytics.track('feedback_viewed', { exerciseId: exercise.id, correct: graded.correct });
  };

  const next = () => {
    setIndex((i) => i + 1);
    setResult(null);
  };

  return (
    <Screen>
      <Text variant="h2">{skillName}</Text>
      <View style={styles.header}>
        <Text variant="caption" color={theme.colors.textMuted}>
          Exercice {index + 1} / {list.length}
        </Text>
        <ProgressBar value={index / list.length} accessibilityLabel="Progression de la session" />
      </View>

      <Card>
        <Text variant="caption" color={theme.colors.primary}>
          {LABELS[exercise.type] ?? 'Exercice'}
        </Text>
        <Text variant="title">{exercise.prompt}</Text>
        <ExercisePlayer exercise={exercise} result={result} onValidate={validate} />
      </Card>

      {result ? (
        <>
          <FeedbackPanel
            correct={result.correct}
            message={result.correct ? result.feedback.correct : result.feedback.incorrect}
            rule={result.feedback.rule}
            whenItFails={result.feedback.whenItFails}
          />
          <CharacterScene
            character={result.correct ? 'toto' : 'bobo'}
            state={result.correct ? 'celebrate-small' : 'encourage'}
            size={60}
            speech={result.correct ? 'Bien joué !' : 'Pas grave — l’important, c’est de comprendre.'}
          />
          <Button label={index + 1 >= list.length ? 'Voir mon résultat' : 'Continuer'} onPress={next} />
        </>
      ) : null}
    </Screen>
  );
}

function Results({
  total,
  correct,
  onComplete,
  onHome,
  onRetry,
}: {
  total: number;
  correct: number;
  onComplete: (passed: boolean) => void;
  onHome: () => void;
  onRetry: () => void;
}) {
  const summary = buildSessionSummary(correct, total, PASS_RATIO);
  const success = summary.passed;
  const done = useRef(false);
  useEffect(() => {
    if (!done.current) {
      done.current = true;
      onComplete(success);
      analytics.track('lesson_completed', { total, correct, passed: success });
    }
  }, [onComplete, success, total, correct]);

  // Barème identique à l'XP réellement enregistré (grade 5 si correct, sinon 2).
  const xp = correct * xpForGrade(5) + (total - correct) * xpForGrade(2);

  return (
    <Screen>
      <Card elevated style={styles.results}>
        <Text variant="display">{summary.emoji}</Text>
        <Text variant="h1" center>
          {correct} / {total}
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} center>
          {summary.headline}
        </Text>

        <View style={styles.accuracyWrap}>
          <ProgressBar value={summary.accuracy} accessibilityLabel={`Précision : ${summary.accuracyPct} %`} />
        </View>

        {/* Trois tuiles récapitulatives (façon Duolingo) */}
        <View style={styles.statTiles}>
          <StatTile label="XP" value={`+${xp}`} color={theme.colors.reward} />
          <StatTile label="Précision" value={`${summary.accuracyPct}%`} color={theme.colors.technical} />
          <StatTile label="Série" value="🔥" color={theme.colors.bullish} />
        </View>

        {summary.tier === 'retry' ? (
          <CharacterScene
            character="toto"
            state="encourage"
            size={72}
            speech="On y retourne quand tu veux."
          />
        ) : (
          <MascotFigure name="celebrate" gesture="celebrate" height={170} />
        )}
      </Card>
      <Button label="Retour à l’accueil" onPress={onHome} />
      <Button label="Refaire la session" variant="secondary" onPress={onRetry} />
    </Screen>
  );
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.tile}>
      <Text variant="title" color={color} center>
        {value}
      </Text>
      <Text variant="caption" color={theme.colors.textMuted} center>
        {label}
      </Text>
    </View>
  );
}

const LABELS: Record<string, string> = {
  mcq: 'Choix multiple',
  true_false: 'Vrai ou faux',
  numeric: 'Réponse numérique',
  order: 'Mets dans l’ordre',
  match: 'Associe',
  find_error: 'Trouve l’erreur',
  identify_pattern: 'Reconnais la figure',
  scenario: 'Scénario',
  select_chart_zone: 'Zone du graphique',
  place_invalidation: 'Place l’invalidation',
  label_chart: 'Étiquette le graphique',
  sequence_market_structure: 'Ordonne la structure',
};

const styles = StyleSheet.create({
  header: { gap: theme.spacing.sm },
  results: { alignItems: 'center', gap: theme.spacing.md },
  accuracyWrap: { width: '100%' },
  statTiles: { flexDirection: 'row', gap: theme.spacing.sm, width: '100%' },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
});
