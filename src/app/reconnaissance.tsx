import { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Card, Button, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { VisualCard } from '@/engines/visual';
import { buildRecognitionSession } from '@/data';

const ROUNDS = 8;
const OPTIONS = 4;

/**
 * « Reconnais la figure » — entraîneur de reconnaissance gamifié et accessible. La figure est
 * affichée en mode énigme (aucune fuite de la réponse, y compris au lecteur d'écran) ; après le
 * choix, le schéma se révèle (étiquettes + résumé accessible). Déterministe par graine.
 */
export default function Reconnaissance() {
  const router = useRouter();
  const [seed, setSeed] = useState(2024);
  const session = useMemo(() => buildRecognitionSession(seed, ROUNDS, OPTIONS), [seed]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const finished = index >= session.length;
  const round = finished ? null : session[index];
  const answered = selected !== null;
  const isCorrect = answered && round !== null && selected === round.correctIndex;

  const choose = (i: number) => {
    if (answered || !round) return;
    setSelected(i);
    if (i === round.correctIndex) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setSelected(null);
    setIndex((i) => i + 1);
  };

  const replay = () => {
    setSeed((s) => s + 1);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
  };

  if (finished) {
    const ratio = Math.round((score / session.length) * 100);
    return (
      <Screen>
        <Text variant="h1">Résultat 🔍</Text>
        <Card elevated style={styles.result}>
          <Text variant="h2">{score} / {session.length} figures reconnues</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Meilleure série : {bestStreak} d’affilée · {ratio}% de réussite.
          </Text>
          <CharacterScene
            character={ratio >= 60 ? 'toto' : 'bobo'}
            state={ratio >= 60 ? 'celebrate-small' : 'encourage'}
            size={64}
            speech={ratio >= 60 ? 'Bel œil ! Ta lecture des figures progresse.' : 'La reconnaissance vient avec la répétition. On recommence ?'}
          />
        </Card>
        <Button label="Rejouer une série" onPress={replay} accessibilityHint="Recommencer avec de nouvelles figures" />
        <Button label="Voir la bibliothèque des figures" variant="secondary" onPress={() => router.push('/bibliotheque-visuelle')} accessibilityHint="Ouvrir la galerie de toutes les figures" />
        <Button label="Retour" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="h1">Reconnais la figure 🔍</Text>
      <View style={styles.meta}>
        <Text variant="caption" color={theme.colors.textMuted}>Figure {index + 1} / {session.length}</Text>
        <Text variant="caption" color={theme.colors.technical}>Score {score} · série {streak}</Text>
      </View>

      <VisualCard spec={round!.spec} blind={!answered} title={answered ? round!.title : undefined} />

      <Text variant="body" color={theme.colors.textSecondary}>
        {answered ? 'Réponse révélée — le schéma est annoté ci-dessus.' : 'Quelle figure est-ce ? Choisis son nom.'}
      </Text>

      <View style={styles.options}>
        {round!.options.map((opt, i) => {
          const correct = answered && i === round!.correctIndex;
          const wrongPick = answered && i === selected && i !== round!.correctIndex;
          return (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityState={{ disabled: answered, selected: i === selected }}
              accessibilityHint={answered ? undefined : `Répondre : ${opt}`}
              disabled={answered}
              onPress={() => choose(i)}
              style={[
                styles.option,
                correct && styles.optionCorrect,
                wrongPick && styles.optionWrong,
              ]}
            >
              <Text variant="body" color={theme.colors.textPrimary} style={styles.flex1}>
                {answered && correct ? '✓ ' : wrongPick ? '✗ ' : ''}
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <Card>
          <Text variant="title" color={isCorrect ? theme.colors.bullish : theme.colors.bearish}>
            {isCorrect ? 'Bien vu !' : `C’était : ${round!.title}`}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {round!.spec.accessibilitySummary}
          </Text>
          <CharacterScene
            character={isCorrect ? 'toto' : 'bobo'}
            state={isCorrect ? 'agree' : 'explain'}
            size={54}
            showName={false}
            speech={isCorrect ? 'Ta lecture est juste.' : 'Retiens sa forme — tu la reverras.'}
          />
          <Button label={index + 1 >= session.length ? 'Voir le résultat' : 'Figure suivante'} onPress={next} accessibilityHint="Passer à la figure suivante" />
        </Card>
      ) : null}

      <Button label="Abandonner" variant="ghost" onPress={() => router.back()} accessibilityHint="Quitter l’entraînement" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  options: { gap: theme.spacing.sm, marginVertical: theme.spacing.sm },
  option: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCorrect: { borderColor: theme.colors.bullish, backgroundColor: `${theme.colors.bullish}22` },
  optionWrong: { borderColor: theme.colors.bearish, backgroundColor: `${theme.colors.bearish}22` },
  result: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  flex1: { flex: 1 },
});
