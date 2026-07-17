import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, ProgressBar, FeedbackPanel, theme } from '@/design-system';
import { CharacterScene, MascotFigure } from '@/characters';
import { ExercisePlayer, gradeExercise, type GradeResult } from '@/engines/exercise';
import { getExercises, skillById, useProgress } from '@/data';
import { xpForGrade } from '@/engines/learning';
import { analytics } from '@/analytics';

/** Seuil de réussite d'une session (déblocage de la compétence). */
const PASS_RATIO = 0.7;

export default function Session() {
  const { skillId } = useLocalSearchParams<{ skillId: string }>();
  const router = useRouter();
  const { recordAnswer, completeSession } = useProgress();

  const resolvedId = skillId && getExercises(skillId).length ? skillId : 'skill.actions';
  const list = getExercises(resolvedId);
  const skillName = skillById(resolvedId)?.name ?? 'Session';

  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [correct, setCorrect] = useState(0);

  const finished = index >= list.length;

  if (finished) {
    return (
      <Results
        total={list.length}
        correct={correct}
        onComplete={(passed) => completeSession(resolvedId, passed)}
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
    recordAnswer(exercise.skillId, graded.correct ? 5 : 2);
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
  const success = correct >= Math.ceil(total * PASS_RATIO);
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
        <Text variant="display">{success ? '🎉' : '💪'}</Text>
        <Text variant="h1" center>
          {correct} / {total}
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} center>
          {success ? 'Session réussie, bravo !' : 'Bien essayé — révise et retente !'}
        </Text>
        <View style={styles.gains}>
          <Text variant="title" color={theme.colors.reward}>
            +{xp} XP
          </Text>
          <Text variant="caption" color={theme.colors.textMuted}>
            série mise à jour 🔥
          </Text>
        </View>
        {success ? (
          <MascotFigure name="celebrate" gesture="celebrate" height={170} />
        ) : (
          <CharacterScene
            character="toto"
            state="encourage"
            size={72}
            speech="On y retourne quand tu veux."
          />
        )}
      </Card>
      <Button label="Retour à l’accueil" onPress={onHome} />
      <Button label="Refaire la session" variant="secondary" onPress={onRetry} />
    </Screen>
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
};

const styles = StyleSheet.create({
  header: { gap: theme.spacing.sm },
  results: { alignItems: 'center', gap: theme.spacing.md },
  gains: { alignItems: 'center', gap: 2 },
});
