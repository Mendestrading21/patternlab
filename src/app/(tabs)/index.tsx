import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, ProgressBar, StateView, theme } from '@/design-system';
import { CharacterScene, MascotFigure } from '@/characters';
import { useProgress, SKILLS, buildDailyMission, selectDueReviews, exercisesForMinutes, OBJECTIVES } from '@/data';
import { DISCLAIMER } from '@/lib/config';

const EXPLORE = [
  { icon: '📚', title: 'Leçons', subtitle: 'Le module « Lire un graphique ».', route: '/lecons' as const },
  { icon: '🎯', title: 'Quiz éclair', subtitle: 'Une session d’exercices variés.', route: '/quiz' as const },
  { icon: '📖', title: 'Glossaire', subtitle: 'Le vocabulaire des marchés.', route: '/glossaire' as const },
  { icon: '🏅', title: 'Réussites', subtitle: 'Tes badges débloqués.', route: '/reussites' as const },
];

export default function Home() {
  const router = useRouter();
  const { state, ready, profile } = useProgress();

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On prépare ta mission du jour…" />
      </Screen>
    );
  }

  const now = Date.now();
  const xpInLevel = state.totalXp % 100;
  const mission = buildDailyMission(state, SKILLS, now);
  const dueCount = selectDueReviews(state, SKILLS, now).length;
  const minutes = profile?.dailyMinutes ?? 5;
  const sessionCount = exercisesForMinutes(minutes);
  const objectiveLabel = OBJECTIVES.find((o) => o.value === profile?.objective)?.label;
  const today = new Date(now).toISOString().slice(0, 10);
  const challenges = [
    { label: 'Termine une session aujourd’hui', done: state.lastActiveDate === today },
    { label: 'Débloque une compétence', done: state.completedSkills.length >= 1 },
    { label: 'Atteins 50 XP au total', done: state.totalXp >= 50 },
  ];
  const challengesDone = challenges.filter((c) => c.done).length;

  const startMission = () =>
    mission.skillId
      ? router.push({ pathname: '/session/[skillId]', params: { skillId: mission.skillId, count: String(sessionCount) } })
      : router.push('/parcours');

  return (
    <Screen>
      <Text variant="h1">Bonjour, apprenti ! 👋</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {objectiveLabel
          ? `Objectif : ${objectiveLabel} · ${minutes} min aujourd’hui.`
          : 'Cinq minutes suffisent. Voici ta mission du jour.'}
      </Text>

      {/* Action principale unique : la mission du jour */}
      <Card elevated>
        <Text variant="label" color={theme.colors.primaryBright}>
          🎯 MISSION DU JOUR
        </Text>
        <Text variant="h2">{mission.skillName || 'Module terminé'}</Text>
        <View style={styles.missionMascot}>
          <MascotFigure name="toto-think" gesture="idle" height={104} />
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          {mission.subtitle}
        </Text>
        {mission.skillId ? (
          <View style={styles.missionMeta}>
            <Chip icon="⏱️" label={`~${minutes} min`} color={theme.colors.technical} />
            <Chip icon="📝" label={`${sessionCount} exercice${sessionCount > 1 ? 's' : ''}`} color={theme.colors.neutral} />
          </View>
        ) : null}
        <View style={styles.cta}>
          <Button label={mission.ctaLabel} onPress={startMission} accessibilityHint="Démarrer la mission du jour" />
        </View>
        <View style={styles.progressStrip}>
          <View style={styles.chips}>
            <Chip icon="⭐" label={`Niv. ${state.level}`} color={theme.colors.primary} />
            <Chip icon="🔥" label={`${state.streakDays} j`} color={theme.colors.warning} />
            <Chip icon="🪙" label={`${state.coins}`} color={theme.colors.reward} />
          </View>
          <ProgressBar value={xpInLevel / 100} accessibilityLabel={`${xpInLevel} sur 100 XP`} />
          <Text variant="caption" color={theme.colors.textMuted}>
            {xpInLevel} / 100 XP vers le niveau {state.level + 1}
          </Text>
        </View>
      </Card>

      {/* Révisions : pointeur compact vers l'onglet dédié */}
      <Pressable accessibilityRole="button" accessibilityHint="Ouvrir les révisions" onPress={() => router.push('/revisions')}>
        <Card style={dueCount ? styles.reviewDue : undefined}>
          <View style={styles.row}>
            <Text variant="title" style={styles.flex1}>
              🔁 Révisions
            </Text>
            <Text variant="title" color={dueCount ? theme.colors.warning : theme.colors.textMuted}>
              {dueCount ? `${dueCount} due${dueCount > 1 ? 's' : ''} ›` : 'À jour ✅ ›'}
            </Text>
          </View>
          <Text variant="caption" color={theme.colors.textMuted}>
            La répétition espacée ramène chaque compétence au bon moment.
          </Text>
        </Card>
      </Pressable>

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
        {EXPLORE.map((e) => (
          <Pressable key={e.route} style={styles.flex1} accessibilityRole="button" onPress={() => router.push(e.route)}>
            <Card style={styles.explore}>
              <Text variant="h2">{e.icon}</Text>
              <Text variant="title">{e.title}</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {e.subtitle}
              </Text>
            </Card>
          </Pressable>
        ))}
      </View>

      <Card>
        <Text variant="title">Conseils de Toto &amp; Bobo</Text>
        <View style={styles.advice}>
          <CharacterScene character="toto" state="explain" size={64} speech="La patience est ton meilleur investissement." />
          <CharacterScene character="bobo" state="warning" size={64} reversed speech="Mais garde toujours un œil sur les risques !" />
        </View>
      </Card>

      <Text variant="caption" color={theme.colors.textMuted} center>
        {DISCLAIMER}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missionMascot: { alignItems: 'center', marginVertical: theme.spacing.sm },
  missionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  cta: { marginVertical: theme.spacing.md },
  progressStrip: { gap: theme.spacing.xs },
  chips: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  reviewDue: { borderColor: theme.colors.warning },
  mission: { marginVertical: theme.spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  advice: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  challenges: { gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  explore: { alignItems: 'flex-start', gap: 2, minHeight: 120 },
});
