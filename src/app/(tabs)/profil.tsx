import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, ProgressBar, theme } from '@/design-system';
import { useReducedMotion } from '@/characters';
import { useProgress, DEMO_SKILL } from '@/data';
import { DISCLAIMER } from '@/lib/config';

export default function Profil() {
  const router = useRouter();
  const { state, reset } = useProgress();
  const reduced = useReducedMotion();
  const mastery = state?.skills[DEMO_SKILL.id]?.mastery ?? 0;

  return (
    <Screen>
      <Text variant="h1">Profil 🐂🐻</Text>

      <Card elevated>
        <Text variant="title">Tes statistiques</Text>
        <View style={styles.stats}>
          <Stat label="Niveau" value={String(state?.level ?? 1)} />
          <Stat label="XP total" value={String(state?.totalXp ?? 0)} />
          <Stat label="Pièces" value={String(state?.coins ?? 0)} />
          <Stat label="Série" value={`${state?.streakDays ?? 0} j`} />
        </View>
      </Card>

      <Card>
        <Text variant="title">{DEMO_SKILL.name}</Text>
        <View style={styles.masteryRow}>
          <ProgressBar value={mastery} accessibilityLabel="Maîtrise" />
        </View>
        <Text variant="caption" color={theme.colors.textMuted}>
          Maîtrise : {Math.round(mastery * 100)} % — plusieurs bonnes révisions sont nécessaires.
        </Text>
      </Card>

      <Card>
        <Text variant="title">Accessibilité</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Réduction des animations : {reduced ? 'activée ✅' : 'désactivée'} (réglage système).
        </Text>
      </Card>

      <Button label="Mes réussites 🏅" onPress={() => router.push('/reussites')} />
      <Button label="Glossaire 📖" variant="secondary" onPress={() => router.push('/glossaire')} />
      <Button
        label="Réglages"
        variant="ghost"
        disabled
        disabledReason="Écran de réglages : prévu bientôt."
      />
      <Button label="Réinitialiser ma progression" variant="secondary" onPress={reset} />

      <Text variant="caption" color={theme.colors.textMuted} center>
        {DISCLAIMER}
      </Text>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="h2">{value}</Text>
      <Text variant="caption" color={theme.colors.textMuted}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg, marginTop: theme.spacing.sm },
  stat: { flexBasis: '40%', gap: 2 },
  masteryRow: { marginVertical: theme.spacing.sm },
});
