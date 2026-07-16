import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, AnswerOption, FeedbackPanel, ProgressBar, theme } from '@/design-system';
import type { AnswerState } from '@/design-system';
import { CharacterScene } from '@/characters';
import { gradeExercise, type McqExercise, type TrueFalseExercise, type GradeResult } from '@/engines/exercise';
import { DEMO_EXERCISES, useProgress } from '@/data';
import { analytics } from '@/analytics';

export default function Quiz() {
  const { recordAnswer } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [score, setScore] = useState(0);

  const exercise = DEMO_EXERCISES[index];
  const finished = index >= DEMO_EXERCISES.length;

  if (finished) {
    return (
      <Screen>
        <Text variant="h1">Quiz éclair 🎯</Text>
        <Card elevated style={styles.center}>
          <Text variant="display">🎉</Text>
          <Text variant="h2" center>
            {score} / {DEMO_EXERCISES.length} bonnes réponses
          </Text>
          <CharacterScene
            character="toto"
            state="celebrate-big"
            speech="Beau travail ! On remet ça quand tu veux."
          />
          <Button
            label="Recommencer"
            onPress={() => {
              setIndex(0);
              setSelected(null);
              setResult(null);
              setScore(0);
            }}
          />
        </Card>
      </Screen>
    );
  }

  const options = exercise.type === 'mcq' ? (exercise as McqExercise).options : ['Vrai', 'Faux'];

  const answer = (i: number) => {
    if (result) return;
    const value = exercise.type === 'true_false' ? i === 0 : i;
    const graded = gradeExercise(exercise, value);
    setSelected(i);
    setResult(graded);
    setScore((s) => s + (graded.correct ? 1 : 0));
    recordAnswer(exercise.skillId, graded.correct ? 5 : 2);
    analytics.track('feedback_viewed', { exerciseId: exercise.id, correct: graded.correct });
  };

  const next = () => {
    setIndex((i) => i + 1);
    setSelected(null);
    setResult(null);
  };

  const stateFor = (i: number): AnswerState => {
    if (!result) return selected === i ? 'selected' : 'idle';
    const correctIdx = exercise.type === 'true_false'
      ? (exercise as TrueFalseExercise).validation.answer ? 0 : 1
      : (exercise as McqExercise).validation.correctIndex;
    if (i === correctIdx) return 'correct';
    if (i === selected) return 'incorrect';
    return 'idle';
  };

  return (
    <Screen>
      <Text variant="h1">Quiz éclair 🎯</Text>
      <ProgressBar value={index / DEMO_EXERCISES.length} accessibilityLabel="Progression du quiz" />
      <Card>
        <Text variant="caption" color={theme.colors.textMuted}>
          Question {index + 1} / {DEMO_EXERCISES.length}
        </Text>
        <Text variant="title">{exercise.prompt}</Text>
        <View style={styles.options}>
          {options.map((opt, i) => (
            <AnswerOption
              key={i}
              index={i}
              label={opt}
              state={stateFor(i)}
              disabled={Boolean(result)}
              onPress={() => answer(i)}
            />
          ))}
        </View>
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
            size={64}
            speech={result.correct ? 'Exact, bravo !' : 'Pas grave — regarde l’explication.'}
          />
          <Button
            label={index + 1 >= DEMO_EXERCISES.length ? 'Voir le résultat' : 'Question suivante'}
            onPress={next}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: { gap: theme.spacing.sm, marginTop: theme.spacing.md },
  center: { alignItems: 'center', gap: theme.spacing.md },
});
