import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Flashcard, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { useProgress, buildRevisionDeck, isPremium } from '@/data';
import { analytics } from '@/analytics';

const deck = buildRevisionDeck();

export default function RevisionDeck() {
  const router = useRouter();
  const { premium, ready } = useProgress();
  const premiumActive = isPremium(premium);

  // On n'enregistre le blocage qu'une fois la progression chargée (sinon premium est encore vide).
  useEffect(() => {
    if (ready && !premiumActive) analytics.track('premium_gate_hit', { feature: 'revision_deck' });
  }, [ready, premiumActive]);

  if (!premiumActive) {
    return (
      <Screen>
        <Text variant="h1">Deck de révision 🃏</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Toutes les flashcards et mini-quiz de tes concepts, réunis pour réviser d’un coup.
        </Text>
        <Card elevated style={styles.gate}>
          <Text variant="title">🔒 Réservé à Premium</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Le deck regroupe {deck.flashcards.length} flashcards et {deck.quizzes.length} mini-quiz issus de{' '}
            {deck.conceptCount} concepts. Les cartes restent disponibles gratuitement sur chaque fiche —
            le deck consolidé est un confort Premium.
          </Text>
          <Button
            label="Débloquer avec Premium ✨"
            variant="reward"
            onPress={() => router.push('/premium')}
            accessibilityHint="Découvrir l’offre Premium"
          />
          <Text variant="caption" color={theme.colors.textMuted}>
            Activation de démonstration — aucun achat réel n’est effectué.
          </Text>
        </Card>
        <Button label="Retour" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="h1">Deck de révision 🃏</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {deck.flashcards.length} flashcards · {deck.quizzes.length} mini-quiz · {deck.conceptCount} concepts.
      </Text>
      <CharacterScene character="bobo" state="review" size={54} showName={false} speech="On révise l’essentiel, une carte à la fois." />

      <Text variant="h2">Flashcards</Text>
      {deck.flashcards.map((f, i) => (
        <View key={`f-${i}`} style={styles.item}>
          <Text variant="caption" color={theme.colors.technical}>
            {f.conceptTitle}
          </Text>
          <Flashcard front={f.front} back={f.back} />
        </View>
      ))}

      <Text variant="h2">Mini-quiz</Text>
      {deck.quizzes.map((q, i) => (
        <View key={`q-${i}`} style={styles.item}>
          <Text variant="caption" color={theme.colors.technical}>
            {q.conceptTitle}
          </Text>
          <Flashcard front={q.question} back={`Réponse : ${q.options[q.correctIndex]} — ${q.explanation}`} />
        </View>
      ))}

      <Button label="Retour" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  gate: { gap: theme.spacing.sm },
  item: { gap: theme.spacing.xs },
});
