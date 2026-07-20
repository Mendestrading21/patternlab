import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Chip, ProgressBar, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { BADGES, earnedBadges, streakInfo, STREAK_MILESTONE_REWARD, useProgress } from '@/data';

export default function Reussites() {
  const { state } = useProgress();
  const earned = earnedBadges(state);
  const streak = streakInfo(state?.streakDays ?? 0);
  // Progression vers le prochain jalon depuis le jalon précédent atteint.
  const prevMilestone = streak.reachedMilestones.at(-1) ?? 0;
  const span = streak.next ? streak.next - prevMilestone : 1;
  const streakProgress = streak.next ? (streak.current - prevMilestone) / span : 1;

  return (
    <Screen>
      <Text variant="h1">Réussites 🏅</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Des badges à débloquer au fil de ta progression.
      </Text>

      <MascotFigure name="celebrate" gesture="celebrate" height={150} decorative />

      <Card elevated>
        <View style={styles.summary}>
          <Text variant="title">🔥 Série</Text>
          <Chip icon="🔥" label={`${streak.current} jour${streak.current > 1 ? 's' : ''}`} color={theme.colors.warning} />
        </View>
        <ProgressBar value={streakProgress} color={theme.colors.warning} accessibilityLabel="Progression vers le prochain jalon de série" />
        <Text variant="caption" color={theme.colors.textMuted}>
          {streak.next
            ? `Encore ${streak.toGo} jour${streak.toGo > 1 ? 's' : ''} jusqu’au jalon ${streak.next} · +${STREAK_MILESTONE_REWARD} 🪙`
            : `Tous les jalons de série sont atteints. Bravo pour ta constance !`}
        </Text>
      </Card>

      <Card elevated>
        <View style={styles.summary}>
          <Text variant="body" color={theme.colors.textSecondary}>
            Badges obtenus
          </Text>
          <Text variant="title" color={theme.colors.reward}>
            {earned.size} / {BADGES.length}
          </Text>
        </View>
        <ProgressBar value={earned.size / BADGES.length} color={theme.colors.reward} accessibilityLabel="Badges obtenus" />
      </Card>

      <Text variant="h2" style={styles.sectionTitle}>
        Progression
      </Text>
      <View style={styles.grid}>{BADGES.filter((b) => b.family !== 'understanding').map(renderBadge)}</View>

      <Text variant="h2" style={styles.sectionTitle}>
        Compréhension
      </Text>
      <Text variant="caption" color={theme.colors.textMuted}>
        Des badges qui récompensent le savoir, la diversité et le repérage des faux signaux — jamais des gains ni la vitesse.
      </Text>
      <View style={styles.grid}>{BADGES.filter((b) => b.family === 'understanding').map(renderBadge)}</View>
    </Screen>
  );

  function renderBadge(b: (typeof BADGES)[number]) {
    const has = earned.has(b.id);
    return (
      <Card key={b.id} style={[styles.badge, !has && styles.locked]}>
        <Text variant="display" center>
          {has ? b.emoji : '🔒'}
        </Text>
        <Text variant="title" center>
          {b.name}
        </Text>
        <Text variant="caption" color={theme.colors.textMuted} center>
          {b.description}
        </Text>
        <Text variant="caption" color={has ? theme.colors.primary : theme.colors.textMuted} center>
          {has ? 'Obtenu ✓' : 'À débloquer'}
        </Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  sectionTitle: { marginTop: theme.spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  badge: { flexGrow: 1, flexBasis: '44%', alignItems: 'center', gap: theme.spacing.xs },
  locked: { opacity: 0.55 },
});
