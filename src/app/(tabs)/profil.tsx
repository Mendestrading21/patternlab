import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, ProgressBar, theme } from '@/design-system';
import { useReducedMotion, CharacterAnimationController } from '@/characters';
import { useProgress, DEMO_SKILL, OBJECTIVES, LEVELS, TOPICS, MASTERY_LABEL, offlineCapabilities } from '@/data';
import { masteryStatus } from '@/engines/learning';
import { useConnectivity } from '@/lib/connectivity';
import { DISCLAIMER } from '@/lib/config';

export default function Profil() {
  const router = useRouter();
  const { state, profile, premium, analyticsEnabled, setAnalyticsEnabled, reset } = useProgress();
  const reduced = useReducedMotion();
  const online = useConnectivity();
  const offline = offlineCapabilities();
  const demoProgress = state?.skills[DEMO_SKILL.id];
  const mastery = demoProgress?.mastery ?? 0;
  const status = demoProgress ? masteryStatus(demoProgress) : 'new';
  const objectiveLabel = OBJECTIVES.find((o) => o.value === profile?.objective)?.label;
  const levelLabel = LEVELS.find((l) => l.value === profile?.level)?.label;

  return (
    <Screen>
      <Text variant="h1">Profil</Text>

      <View style={styles.heroDuo}>
        <CharacterAnimationController character="toto" state="wave" size={76} />
        <CharacterAnimationController character="bobo" state="idle" size={76} />
      </View>

      <Card elevated>
        <Text variant="title">Tes statistiques</Text>
        <View style={styles.stats}>
          <Stat label="Niveau" value={String(state?.level ?? 1)} />
          <Stat label="XP total" value={String(state?.totalXp ?? 0)} />
          <Stat label="Pièces" value={String(state?.coins ?? 0)} />
          <Stat label="Série" value={`${state?.streakDays ?? 0} j`} />
        </View>
        <Button
          label="Voir le détail 📊"
          variant="secondary"
          onPress={() => router.push('/statistiques')}
          accessibilityHint="Ouvrir le tableau de statistiques détaillé"
        />
      </Card>

      <Card>
        <Text variant="title">Ton profil</Text>
        {profile ? (
          <>
            <View style={styles.profileRows}>
              <ProfileRow label="Objectif" value={objectiveLabel ?? '—'} />
              <ProfileRow label="Niveau déclaré" value={levelLabel ?? '—'} />
              <ProfileRow label="Temps / jour" value={`${profile.dailyMinutes} min`} />
              <ProfileRow
                label="Diagnostic"
                value={
                  profile.diagnosticDone && profile.diagnosticScore != null
                    ? `${Math.round(profile.diagnosticScore * 100)} %`
                    : 'non réalisé'
                }
              />
            </View>
            {profile.topics.length ? (
              <View style={styles.topicChips}>
                {profile.topics.map((t) => (
                  <Chip key={t} label={TOPICS.find((x) => x.value === t)?.label ?? t} color={theme.colors.neutral} />
                ))}
              </View>
            ) : null}
            <Button
              label="Repersonnaliser mon parcours"
              variant="secondary"
              onPress={() => router.push('/onboarding')}
              accessibilityHint="Refaire l’onboarding personnalisé"
            />
          </>
        ) : (
          <>
            <Text variant="body" color={theme.colors.textSecondary}>
              Personnalise ton parcours en quelques questions (objectif, niveau, temps, sujets).
            </Text>
            <Button label="Personnaliser mon parcours" onPress={() => router.push('/onboarding')} />
          </>
        )}
      </Card>

      <Card>
        <View style={styles.skillHead}>
          <Text variant="title" style={styles.flex1}>
            {DEMO_SKILL.name}
          </Text>
          <Chip label={MASTERY_LABEL[status]} color={theme.colors.primary} />
        </View>
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

      <Card>
        <View style={styles.skillHead}>
          <Text variant="title" style={styles.flex1}>
            Mode hors-ligne 📶
          </Text>
          <Chip
            label={online ? 'En ligne' : 'Hors ligne'}
            color={online ? theme.colors.bullish : theme.colors.textMuted}
          />
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          PatternLab fonctionne entièrement hors-ligne. Ta progression est enregistrée sur cet
          appareil, sans dépendance réseau.
        </Text>
        <Text variant="caption" color={theme.colors.textMuted}>
          Embarqués : {offline.skills} compétences · {offline.lessons} leçons · {offline.exercises}{' '}
          exercices · {offline.unifiedGlossary} termes · {offline.concepts} fiches concept ·{' '}
          {offline.visualDatasets} visuels · {offline.worlds} mondes. Les visuels sont générés en code,
          jamais téléchargés.
        </Text>
      </Card>

      <Card>
        <Text variant="title">Confidentialité</Text>
        <Text variant="body" color={theme.colors.textSecondary}>
          Suivi d’usage anonyme pour améliorer l’app. Aucune donnée personnelle ni financière n’est
          collectée. Tu peux le désactiver à tout moment.
        </Text>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: analyticsEnabled }}
          accessibilityHint="Activer ou désactiver le suivi d’usage anonyme"
          onPress={() => setAnalyticsEnabled(!analyticsEnabled)}
          style={styles.toggle}
        >
          <Text variant="body" style={styles.flex1}>
            Suivi d’usage anonyme
          </Text>
          <View style={[styles.pill, analyticsEnabled ? styles.pillOn : styles.pillOff]}>
            <Text variant="label" color={analyticsEnabled ? theme.colors.onPrimary : theme.colors.textSecondary}>
              {analyticsEnabled ? 'Activé' : 'Désactivé'}
            </Text>
          </View>
        </Pressable>
      </Card>

      <Card elevated>
        <View style={styles.skillHead}>
          <Text variant="title" style={styles.flex1}>
            PatternLab Premium ✨
          </Text>
          {premium.active ? <Chip label="Actif" color={theme.colors.reward} /> : null}
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          {premium.active
            ? 'Merci ! Tout le contenu premium est débloqué.'
            : 'Tous les mondes, le labo complet, les statistiques détaillées et les révisions illimitées.'}
        </Text>
        <Button
          label={premium.active ? 'Gérer mon accès ✨' : 'Découvrir Premium ✨'}
          variant={premium.active ? 'secondary' : 'reward'}
          onPress={() => router.push('/premium')}
          accessibilityHint="Ouvrir l’offre Premium"
        />
      </Card>

      <Button label="Mes réussites 🏅" onPress={() => router.push('/reussites')} />
      <Button label="Glossaire 📖" variant="secondary" onPress={() => router.push('/glossaire')} />
      <Button
        label="À propos & mentions légales"
        variant="secondary"
        onPress={() => router.push('/a-propos')}
        accessibilityHint="Version, confidentialité et mentions légales"
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text variant="body" color={theme.colors.textSecondary}>
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroDuo: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xl },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg, marginTop: theme.spacing.sm },
  stat: { flexBasis: '40%', gap: 2 },
  masteryRow: { marginVertical: theme.spacing.sm },
  skillHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  profileRows: { gap: theme.spacing.xs, marginVertical: theme.spacing.sm },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicChips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.sm, minHeight: 44 },
  pill: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.radius.pill, borderWidth: 1 },
  pillOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  pillOff: { backgroundColor: 'transparent', borderColor: theme.colors.borderStrong },
});
