import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Button, Card, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { useProgress } from '@/data';
import { analytics } from '@/analytics';
import { PILLARS } from '@/lib/config';

export default function Onboarding() {
  const router = useRouter();
  const { markOnboarded } = useProgress();

  useEffect(() => {
    analytics.track('onboarding_started');
  }, []);

  const start = () => {
    markOnboarded();
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <Text variant="h1">Bienvenue 👋</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Voici ta boucle quotidienne. Quelques minutes suffisent.
      </Text>

      <CharacterScene
        character="toto"
        state="explain"
        speech="Moi c’est Toto. Je repère les opportunités et j’aime comprendre pourquoi ça monte."
      />
      <CharacterScene
        character="bobo"
        state="warning"
        reversed
        speech="Et moi Bobo. Je garde toujours un œil sur le risque et l’invalidation."
      />

      <View style={styles.grid}>
        {PILLARS.map((p) => (
          <Card key={p.id} style={styles.pillar}>
            <Text variant="h2">{p.emoji}</Text>
            <Text variant="title">{p.title}</Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              {p.text}
            </Text>
          </Card>
        ))}
      </View>

      <Button label="Continuer" onPress={start} accessibilityHint="Accéder à l’accueil" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  pillar: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: theme.spacing.xs,
  },
});
