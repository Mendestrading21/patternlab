import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, ProgressBar, theme } from '@/design-system';
import { CharacterAnimationController, CharacterScene, MascotFigure } from '@/characters';
import { useProgress, SKILLS } from '@/data';
import { isDue } from '@/engines/learning';
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
  const now = Date.now();
  const currentSkill = SKILLS.find((s) => !state.completedSkills.includes(s.id)) ?? SKILLS[0];
  const dueSkills = SKILLS.filter(
    (s) => state.completedSkills.includes(s.id) && state.skills[s.id] && isDue(state.skills[s.id].review, now),
  );
  const today = new Date(now).toISOString().slice(0, 10);
  const challenges = [
    { label: 'Termine une session aujourd’hui', done: state.lastActiveDate === today },
    { label: 'Débloque une compétence', done: state.completedSkills.length >= 1 },
    { label: 'Atteins 50 XP au total', done: state.totalXp >= 50 },
  ];
  const challengesDone = challenges.filter((c) => c.done).length;

  return (
    <Screen>
      <Text variant="h1">Bonjour, apprenti ! 👋</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Prêt à continuer ton parcours ?
      </Text>

      <MascotFigure name="welcome" height={150} />

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
        <Button
          label={`Continuer — ${currentSkill.name}`}
          onPress={() => router.push(`/session/${currentSkill.id}`)}
        />
      </Card>

      <Card style={dueSkills.length ? styles.reviewDue : undefined}>
        <Text variant="title">🔁 À réviser</Text>
        {dueSkills.length ? (
          <>
            <Text variant="body" color={theme.colors.textSecondary}>
              {dueSkills.length} compétence{dueSkills.length > 1 ? 's' : ''} à consolider (répétition espacée).
            </Text>
            <Button
              label={`Réviser — ${dueSkills[0].name}`}
              variant="secondary"
              onPress={() => router.push(`/session/${dueSkills[0].id}`)}
            />
          </>
        ) : (
          <Text variant="body" color={theme.colors.textSecondary}>
            Rien à réviser pour l’instant. Termine des compétences, elles reviendront au bon moment. ✅
          </Text>
        )}
      </Card>

      <Card>
        <Text variant="title">🏹 Défis du jour</Text>
        <View style={styles.challenges}>
          {challenges.map((c) => (
            <View key={c.label} style={styles.challengeRow}>
              <Text variant="body">{c.done ? '✅' : '⚪️'}</Text>
              <Text variant="body" color={c.done ? theme.colors.textPrimary : theme.colors.textSecondary} style={styles.flex1}>
                {c.label}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.mission}>
          <ProgressBar value={challengesDone / challenges.length} color={theme.colors.reward} />
        </View>
        <Text variant="caption" color={theme.colors.textMuted}>
          {challengesDone} / {challenges.length} défis relevés
        </Text>
      </Card>

      <Text variant="h2">Explorer</Text>
      <View style={styles.grid}>
        <Pressable style={styles.flex1} accessibilityRole="button" onPress={() => router.push('/glossaire')}>
          <Card style={styles.explore}>
            <Text variant="h2">📖</Text>
            <Text variant="title">Glossaire</Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Le vocabulaire des marchés.
            </Text>
          </Card>
        </Pressable>
        <Pressable style={styles.flex1} accessibilityRole="button" onPress={() => router.push('/reussites')}>
          <Card style={styles.explore}>
            <Text variant="h2">🏅</Text>
            <Text variant="title">Réussites</Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Tes badges débloqués.
            </Text>
          </Card>
        </Pressable>
      </View>

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
  reviewDue: { borderColor: theme.colors.warning },
  challenges: { gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  explore: { alignItems: 'flex-start', gap: 2, minHeight: 120 },
});
