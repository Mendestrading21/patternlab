import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, ProgressBar, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { BADGES, earnedBadges, useProgress } from '@/data';

export default function Reussites() {
  const { state } = useProgress();
  const earned = earnedBadges(state);

  return (
    <Screen>
      <Text variant="h1">Réussites 🏅</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Des badges à débloquer au fil de ta progression.
      </Text>

      <MascotFigure name="celebrate" gesture="celebrate" height={150} />

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

      <View style={styles.grid}>
        {BADGES.map((b) => {
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
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  badge: { flexGrow: 1, flexBasis: '44%', alignItems: 'center', gap: theme.spacing.xs },
  locked: { opacity: 0.55 },
});
