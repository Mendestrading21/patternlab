import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, ProgressBar, Chip, StateView, theme } from '@/design-system';
import { CharacterScene, mascotPresence } from '@/characters';
import { useProgress, SKILLS, selectDueReviews, MASTERY_LABEL } from '@/data';
import { isDue, masteryStatus, errorCount, type MasteryStatus } from '@/engines/learning';

const DAY_MS = 24 * 60 * 60 * 1000;

function nextReviewLabel(dueAt: number, now: number): string {
  if (now >= dueAt) return 'À réviser maintenant';
  const days = Math.ceil((dueAt - now) / DAY_MS);
  return days <= 1 ? 'Demain' : `Dans ${days} jours`;
}

const STATUS_COLOR: Record<MasteryStatus, string> = {
  new: theme.colors.textMuted,
  learning: theme.colors.technical,
  fragile: theme.colors.warning,
  reviewing: theme.colors.technical,
  strong: theme.colors.bullish,
  mastered: theme.colors.primary,
};

export default function Revisions() {
  const router = useRouter();
  const { state, ready } = useProgress();

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On rassemble tes révisions…" />
      </Screen>
    );
  }

  const now = Date.now();
  const due = selectDueReviews(state, SKILLS, now);
  const started = SKILLS.filter((s) => state.completedSkills.includes(s.id));

  return (
    <Screen>
      <Text variant="h1">Révisions 🔁</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        La répétition espacée ramène chaque compétence au bon moment pour ancrer ta mémoire.
      </Text>

      {/* Écran dense (liste) → présence compacte : une seule mascotte discrète (gouverneur de fréquence). */}
      {mascotPresence('review') === 'compact' ? (
        <CharacterScene character="bobo" state="review" size={54} showName={false} speech="On consolide ce qui compte, au bon moment." />
      ) : null}

      <Card elevated style={due.length ? styles.dueCard : undefined}>
        <Text variant="title">À réviser aujourd’hui</Text>
        {due.length ? (
          <>
            <Text variant="body" color={theme.colors.textSecondary}>
              {due.length} compétence{due.length > 1 ? 's' : ''} due{due.length > 1 ? 's' : ''}.
            </Text>
            {due.map((s) => (
              <Button
                key={s.id}
                label={`Réviser — ${s.name}`}
                onPress={() => router.push(`/session/${s.id}`)}
                accessibilityHint="Lancer une session de révision"
              />
            ))}
          </>
        ) : (
          <Text variant="body" color={theme.colors.textSecondary}>
            Rien de dû pour l’instant. ✅ Termine des compétences : elles reviendront au bon moment.
          </Text>
        )}
      </Card>

      <Text variant="h2">Vue d’ensemble</Text>
      {started.length === 0 ? (
        <StateView
          variant="empty"
          icon="🌱"
          title="Aucune compétence terminée"
          message="Commence le parcours : chaque compétence réussie entre ensuite en révision."
        />
      ) : (
        started.map((s) => {
          const sp = state.skills[s.id];
          const mastery = sp?.mastery ?? 0;
          const dueNow = sp ? isDue(sp.review, now) : false;
          const status = sp ? masteryStatus(sp) : 'new';
          const errors = sp ? errorCount(sp) : 0;
          return (
            <Card key={s.id}>
              <View style={styles.row}>
                <Text variant="title" style={styles.flex1}>
                  {s.name}
                </Text>
                <Chip label={MASTERY_LABEL[status]} color={STATUS_COLOR[status]} />
              </View>
              <View style={styles.masteryRow}>
                <ProgressBar value={mastery} accessibilityLabel={`Maîtrise ${Math.round(mastery * 100)} %`} />
              </View>
              <View style={styles.metaRow}>
                <Text variant="caption" color={theme.colors.textMuted} style={styles.flex1}>
                  Maîtrise : {Math.round(mastery * 100)} %
                </Text>
                <Text variant="caption" color={dueNow ? theme.colors.warning : theme.colors.textMuted}>
                  {dueNow ? 'À réviser' : nextReviewLabel(sp?.review.dueAt ?? now, now)}
                </Text>
              </View>
              {errors > 0 ? (
                <Text variant="caption" color={theme.colors.bearish}>
                  🚩 {errors} erreur{errors > 1 ? 's' : ''} à retravailler — une révision les reprogramme.
                </Text>
              ) : null}
            </Card>
          );
        })
      )}

      <Button
        label="Continuer le parcours"
        variant="secondary"
        onPress={() => router.push('/parcours')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dueCard: { borderColor: theme.colors.warning },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  masteryRow: { marginVertical: theme.spacing.sm },
});
