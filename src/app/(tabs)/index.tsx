import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, ProgressBar, StateView, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { MiniVisual } from '@/engines/visual';
import {
  useProgress,
  SKILLS,
  buildDailyMission,
  selectDueReviews,
  exercisesForMinutes,
  OBJECTIVES,
  conceptOfTheDay,
  V5_CONCEPTS,
  greetingFor,
} from '@/data';
import { analytics } from '@/analytics';
import { Disclaimer } from '@/components/Disclaimer';
import { useNow } from '@/lib/useNow';

/**
 * Accueil recentré (Learning-Master Lot 1) : une action principale (mission du jour) + progression
 * compacte + révision due + concept du jour. Le catalogue d'apprentissage vit dans l'onglet
 * « Apprendre » ; les quêtes vivent dans « Réussites ». L'accueil ne porte plus de grille de
 * raccourcis ni de blocs concurrents.
 */
export default function Home() {
  const router = useRouter();
  const { state, ready, profile } = useProgress();
  const now = useNow();

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On prépare ta mission du jour…" />
      </Screen>
    );
  }

  const xpInLevel = state.totalXp % 100;
  const mission = buildDailyMission(state, SKILLS, now);
  const dueCount = selectDueReviews(state, SKILLS, now).length;
  const minutes = profile?.dailyMinutes ?? 5;
  const sessionCount = exercisesForMinutes(minutes);
  const objectiveLabel = OBJECTIVES.find((o) => o.value === profile?.objective)?.label;
  const featured = conceptOfTheDay(V5_CONCEPTS, now);
  const greeting = greetingFor(new Date(now).getHours());

  const startMission = () => {
    if (mission.skillId) {
      analytics.track('daily_mission_started', { skillId: mission.skillId, count: sessionCount });
      router.push({ pathname: '/session/[skillId]', params: { skillId: mission.skillId, count: String(sessionCount) } });
    } else {
      router.push('/parcours');
    }
  };

  return (
    <Screen>
      <Text variant="h1">{greeting}, apprenti ! 👋</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {objectiveLabel
          ? `Objectif : ${objectiveLabel} · ${minutes} min aujourd’hui.`
          : 'Cinq minutes suffisent. Voici ta mission du jour.'}
      </Text>

      {/* Action principale unique : la mission du jour (progression compacte incluse) */}
      <Card elevated>
        <Text variant="label" color={theme.colors.primaryBright}>
          🎯 MISSION DU JOUR
        </Text>
        <Text variant="h2">{mission.skillName || 'Module terminé'}</Text>
        <View style={styles.missionMascot}>
          <MascotFigure name="toto-think" gesture="idle" height={104} decorative />
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

      {/* Révision due : pointeur compact vers l'onglet Réviser */}
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

      {/* Concept du jour : hook de rétention + signal visuel (rotation déterministe) */}
      {featured ? (
        <Pressable
          accessibilityRole="button"
          accessibilityHint={`Découvrir le concept du jour : ${featured.title}`}
          onPress={() => router.push(`/concept/${featured.slug}`)}
        >
          <Card style={styles.conceptCard}>
            <Text variant="label" color={theme.colors.advanced}>
              💡 CONCEPT DU JOUR
            </Text>
            <Text variant="h2">{featured.title}</Text>
            {featured.visualSpec ? (
              <View style={styles.conceptVisual}>
                <MiniVisual spec={featured.visualSpec} width={150} />
              </View>
            ) : null}
            <Text variant="body" color={theme.colors.textSecondary}>
              {featured.definitionShort}
            </Text>
            <Text variant="caption" color={theme.colors.technical}>
              Découvrir la fiche ›
            </Text>
          </Card>
        </Pressable>
      ) : null}

      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  missionMascot: { alignItems: 'center', marginVertical: theme.spacing.sm },
  conceptCard: { borderColor: theme.colors.advanced, gap: theme.spacing.xs },
  conceptVisual: { alignItems: 'center', marginVertical: theme.spacing.xs },
  missionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  cta: { marginVertical: theme.spacing.md },
  progressStrip: { gap: theme.spacing.xs },
  chips: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  reviewDue: { borderColor: theme.colors.warning },
  flex1: { flex: 1 },
});
