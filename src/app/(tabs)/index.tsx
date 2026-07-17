import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, ProgressBar, theme } from '@/design-system';
import { CharacterAnimationController, CharacterScene } from '@/characters';
import { useProgress, DEMO_SKILL } from '@/data';
import { PILLARS, DISCLAIMER } from '@/lib/config';

export default function Home() {
  const router = useRouter();
  const { state, ready } = useProgress();

  if (!ready || !state) {
    return (
      <Screen>
        <Text variant="body" color={theme.colors.textSecondary}>
          Chargement…
        </Text>
      </Screen>
    );
  }

  const xpInLevel = state.totalXp % 100;

  return (
    <Screen>
      <Text variant="h1">Bonjour, apprenti ! 👋</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Prêt à continuer ton parcours ?
      </Text>

      <Card elevated>
        <View style={styles.levelRow}>
          <View style={styles.levelInfo}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Ton niveau
            </Text>
            <Text variant="display">{state.level}</Text>
            <View style={styles.chips}>
              <Chip icon="🔥" label={`${state.streakDays} j`} color={theme.colors.warning} />
              <Chip icon="🪙" label={`${state.coins}`} color={theme.colors.reward} />
            </View>
          </View>
          <View style={styles.duo}>
            <CharacterAnimationController character="toto" state="celebrate-small" size={64} />
            <CharacterAnimationController character="bobo" state="idle" size={64} />
          </View>
        </View>
        <View style={styles.xp}>
          <ProgressBar value={xpInLevel / 100} accessibilityLabel={`${xpInLevel} sur 100 XP`} />
          <Text variant="caption" color={theme.colors.textMuted}>
            {xpInLevel} / 100 XP vers le niveau {state.level + 1}
          </Text>
        </View>
        <Button label="Continuer" onPress={() => router.push(`/session/${DEMO_SKILL.id}`)} />
      </Card>

      <Card>
        <Text variant="title">🎯 Mission du jour</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Termine une leçon pour garder ta série.
        </Text>
        <View style={styles.mission}>
          <ProgressBar value={0} color={theme.colors.primary} />
        </View>
        <Button
          label="Voir les leçons"
          variant="secondary"
          onPress={() => router.push('/(tabs)/lecons')}
        />
      </Card>

      <Text variant="h2">Les 4 piliers</Text>
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

      <Card>
        <Text variant="title">Conseils de Toto &amp; Bobo</Text>
        <View style={styles.advice}>
          <CharacterScene
            character="toto"
            state="explain"
            size={64}
            speech="La patience est ton meilleur investissement."
          />
          <CharacterScene
            character="bobo"
            state="warning"
            size={64}
            reversed
            speech="Mais n’oublie pas de garder un œil sur les risques !"
          />
        </View>
      </Card>

      <Text variant="caption" color={theme.colors.textMuted} center>
        {DISCLAIMER}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelInfo: { gap: theme.spacing.xs },
  chips: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  duo: { flexDirection: 'row', gap: theme.spacing.xs },
  xp: { gap: theme.spacing.xs, marginVertical: theme.spacing.md },
  mission: { marginVertical: theme.spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  pillar: { flexGrow: 1, flexBasis: '45%', gap: theme.spacing.xs },
  advice: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
});
