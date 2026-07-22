import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, ProgressBar, XPBar, TrademyIcon, theme } from '@/design-system';
import { useReducedMotion, CharacterAnimationController } from '@/characters';
import {
  useProgress,
  DEMO_SKILL,
  OBJECTIVES,
  LEVELS,
  TOPICS,
  MASTERY_LABEL,
  offlineCapabilities,
  V5_CONCEPTS,
  SKILLS,
  conceptMasteryStatus,
  selectDueReviews,
  summarizeMisconceptions,
} from '@/data';
import { masteryStatus } from '@/engines/learning';
import { useConnectivity } from '@/lib/connectivity';
import { Disclaimer } from '@/components/Disclaimer';
import { useNow } from '@/lib/useNow';

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

  const now = useNow();
  const xpInLevel = (state?.totalXp ?? 0) % 100;
  const exploredSlugs = state?.learning?.conceptsExplored ?? [];
  const skills = state?.skills ?? {};
  const masteredCount = V5_CONCEPTS.filter((c) => conceptMasteryStatus(c, { exploredSlugs, skills }).mastered).length;
  const dueCount = state ? selectDueReviews(state, SKILLS, now).length : 0;
  const allErrorTags: Record<string, number> = {};
  for (const sp of Object.values(skills)) {
    for (const [tag, n] of Object.entries(sp.errorTags ?? {})) allErrorTags[tag] = (allErrorTags[tag] ?? 0) + n;
  }
  const weakSpots = summarizeMisconceptions(allErrorTags).slice(0, 3);

  return (
    <Screen>
      <Text variant="h1">Profil</Text>

      <View style={styles.heroDuo}>
        <CharacterAnimationController character="toto" state="wave" size={76} />
        <CharacterAnimationController character="bobo" state="idle" size={76} />
      </View>

      <Card elevated>
        <Text variant="title">Ta progression</Text>
        <View style={styles.xpWrap}>
          <XPBar level={state?.level ?? 1} xpInLevel={xpInLevel} />
        </View>
        <View style={styles.statChips}>
          <Chip iconName="flame" label={`${state?.streakDays ?? 0} j de série`} color={theme.colors.warning} />
          <Chip iconName="bolt" label={`${state?.coins ?? 0} points`} color={theme.colors.reward} />
          <Chip iconName="trophy" label={`${masteredCount} concept${masteredCount > 1 ? 's' : ''} maîtrisé${masteredCount > 1 ? 's' : ''}`} color={theme.colors.primary} />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Ouvrir les révisions recommandées"
          onPress={() => router.push('/revisions')}
          style={styles.reviewRow}
        >
          <TrademyIcon name="refresh" size={20} color={dueCount ? theme.colors.warning : theme.colors.primaryBright} />
          <Text variant="body" style={styles.flex1}>
            {dueCount
              ? `${dueCount} révision${dueCount > 1 ? 's' : ''} recommandée${dueCount > 1 ? 's' : ''}`
              : 'Révisions à jour'}
          </Text>
          <TrademyIcon name="chevron-right" size={18} color={theme.colors.textMuted} />
        </Pressable>
        <Button
          label="Voir le détail"
          variant="secondary"
          onPress={() => router.push('/statistiques')}
          accessibilityHint="Ouvrir le tableau de statistiques détaillé"
        />
      </Card>

      {weakSpots.length ? (
        <Card>
          <View style={styles.skillHead}>
            <TrademyIcon name="target" size={18} color={theme.colors.feedbackIncorrect} />
            <Text variant="title" style={styles.flex1}>
              Tes erreurs fréquentes
            </Text>
          </View>
          <Text variant="caption" color={theme.colors.textMuted}>
            Les idées fausses qui reviennent le plus — vise-les en priorité.
          </Text>
          {weakSpots.map((w) => (
            <View key={w.misconception.id} style={styles.weakRow}>
              <Text variant="label" color={theme.colors.feedbackIncorrect}>
                {w.misconception.label}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {w.misconception.hint}
              </Text>
            </View>
          ))}
          <Button
            label="M’entraîner sur mes erreurs"
            variant="secondary"
            onPress={() => router.push('/revisions')}
            accessibilityHint="Ouvrir les révisions"
          />
        </Card>
      ) : null}

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
          Trademy fonctionne entièrement hors-ligne. Ta progression est enregistrée sur cet
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
        <Button
          label="Voir le journal d’usage (local)"
          variant="secondary"
          onPress={() => router.push('/journal')}
          accessibilityHint="Voir exactement les évènements enregistrés localement"
        />
      </Card>

      <Card elevated>
        <View style={styles.skillHead}>
          <Text variant="title" style={styles.flex1}>
            Trademy Premium ✨
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

      <Disclaimer />
    </Screen>
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
  xpWrap: { marginVertical: theme.spacing.sm },
  statChips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, minHeight: 44, marginBottom: theme.spacing.xs },
  weakRow: { gap: 1, marginTop: theme.spacing.xs },
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
