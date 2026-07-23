import { useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, Chip, ProgressBar, StateView, TrademyIcon, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { MiniVisual } from '@/engines/visual';
import {
  WORLDS,
  V5_CONCEPTS,
  buildLearningPath,
  worldsOpen,
  worldsDone,
  levelBandForOrder,
  conceptMasteryStatus,
  useProgress,
  type WorldEntry,
  type WorldStatus,
  type LevelBandDef,
} from '@/data';

/**
 * Espace « Apprendre » — chemin UNIQUE (roadmap des 15 mondes), organisé en trois niveaux
 * (Débutant / Intermédiaire / Avancé). États canoniques : verrouillé, disponible, en cours,
 * terminé, maîtrisé. Déblocage fondé sur la maîtrise (checkpoint du monde guidé, ou toutes les
 * fiches consultées) ; un monde est « maîtrisé » quand ses fiches sont maîtrisées (compétence solide).
 */
const WORLD_COLORS: Record<WorldStatus, string> = {
  done: theme.colors.primary,
  explored: theme.colors.technical,
  current: theme.colors.primaryBright,
  unlocked: theme.colors.technical,
  locked: theme.colors.textMuted,
};

const nodeColor = (entry: WorldEntry) =>
  entry.mastered ? theme.colors.reward : WORLD_COLORS[entry.status];

/** Jalons (« paliers ») affichés après certains mondes. */
const MILESTONES: Record<number, string> = {
  3: 'Fondations posées',
  7: 'Tu lis le prix',
  11: 'Concepts avancés',
  15: 'Tour complet des mondes',
};

const LEGEND: { label: string; color: string }[] = [
  { label: 'Disponible', color: theme.colors.technical },
  { label: 'En cours', color: theme.colors.primaryBright },
  { label: 'Terminé', color: theme.colors.primary },
  { label: 'Maîtrisé', color: theme.colors.reward },
  { label: 'Verrouillé', color: theme.colors.textMuted },
];

export default function Apprendre() {
  const router = useRouter();
  const { state, ready } = useProgress();

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On déroule ta carte…" />
      </Screen>
    );
  }

  const exploredSlugs = state.learning?.conceptsExplored ?? [];
  const masteredSlugs = V5_CONCEPTS.filter(
    (c) =>
      conceptMasteryStatus(c, {
        exploredSlugs,
        skills: state.skills ?? {},
        completedSkills: state.completedSkills ?? [],
      }).mastered,
  ).map((c) => c.slug);

  const path = buildLearningPath(WORLDS, V5_CONCEPTS, {
    completedSkills: state.completedSkills,
    exploredSlugs,
    masteredSlugs,
  });
  const open = worldsOpen(path);
  const done = worldsDone(path);

  return (
    <Screen>
      <Text variant="label" color={theme.colors.technical}>
        APPRENDRE
      </Text>
      <Text variant="h1">Ton parcours</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Un seul chemin, du niveau zéro à l’analyse autonome. Chaque monde s’ouvre quand tu as terminé
        le précédent.
      </Text>

      <View style={styles.headerMascot}>
        <MascotFigure name="toto-present" height={104} />
      </View>
      <View style={styles.progressBlock}>
        <ProgressBar value={done / WORLDS.length} accessibilityLabel={`${done} mondes terminés sur ${WORLDS.length}`} />
        <Text variant="caption" color={theme.colors.textMuted}>
          {done}/{WORLDS.length} mondes terminés · {open}/{WORLDS.length} débloqués
        </Text>
      </View>

      <View style={styles.legend}>
        {LEGEND.map((l) => (
          <View key={l.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: l.color }]} />
            <Text variant="caption" color={theme.colors.textMuted}>
              {l.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.trail}>
        {path.map((entry, i) => {
          const band = levelBandForOrder(entry.world.order);
          const prevBand = i > 0 ? levelBandForOrder(path[i - 1].world.order) : null;
          const showHeader = !prevBand || prevBand.band !== band.band;
          return (
            <View key={entry.world.id}>
              {showHeader ? <BandHeader def={band} /> : null}
              <WorldNode entry={entry} onOpen={() => router.push(`/monde/${entry.world.id}`)} />
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

function BandHeader({ def }: { def: LevelBandDef }) {
  return (
    <View style={styles.bandHeader}>
      <Text variant="label" color={theme.colors.textSecondary}>
        {def.label.toUpperCase()}
      </Text>
      <View style={styles.bandLine} />
    </View>
  );
}

function StatusChip({ entry }: { entry: WorldEntry }) {
  if (entry.mastered) return <Chip iconName="trophy" label="Maîtrisé" color={theme.colors.reward} />;
  if (entry.status === 'done') return <Chip iconName="check" label="Terminé" color={theme.colors.primary} />;
  if (entry.status === 'explored') return <Chip iconName="check" label="Exploré" color={theme.colors.technical} />;
  if (entry.status === 'current') return <Chip label="En cours" color={theme.colors.primaryBright} />;
  if (entry.status === 'locked') return <Chip iconName="lock" label="Verrouillé" color={theme.colors.textMuted} />;
  if (entry.guided) return <Chip label="Guidé" color={theme.colors.technical} />;
  return <Chip label="Disponible" color={theme.colors.technical} />;
}

function WorldNode({ entry, onOpen }: { entry: WorldEntry; onOpen: () => void }) {
  const color = nodeColor(entry);
  const locked = entry.status === 'locked';
  const filled = entry.status === 'done' || entry.mastered;
  const milestone = MILESTONES[entry.world.order];

  return (
    <>
      <View style={styles.trailRow}>
        <View style={styles.rail}>
          {entry.world.order > 1 ? (
            <View style={[styles.connector, { backgroundColor: locked ? theme.colors.border : color }]} />
          ) : (
            <View style={styles.connector} />
          )}
          <View style={[styles.badge, { borderColor: color, backgroundColor: filled ? color : theme.colors.surface }]}>
            {locked ? (
              <TrademyIcon name="lock" size={20} color={color} />
            ) : entry.mastered ? (
              <TrademyIcon name="trophy" size={20} color={theme.colors.onReward} />
            ) : entry.status === 'done' ? (
              <TrademyIcon name="check" size={20} color={theme.colors.onPrimary} />
            ) : (
              <Text variant="label" color={color}>
                {entry.world.order}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.labelWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: false }}
            accessibilityHint={locked ? `Ouvrir ${entry.world.title} (verrouillé — voir pourquoi)` : `Ouvrir le monde ${entry.world.title}`}
            onPress={onOpen}
          >
            <Card style={[styles.worldCard, { borderColor: locked ? theme.colors.border : color }]}>
              <View style={styles.worldHead}>
                <View style={styles.flex1}>
                  <Text variant="title" color={locked ? theme.colors.textMuted : theme.colors.textPrimary}>
                    {entry.world.title}
                  </Text>
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {entry.world.subtitle}
                  </Text>
                </View>
                <StatusChip entry={entry} />
              </View>

              {!locked && entry.sampleSpec ? (
                <View style={styles.worldVisual}>
                  <MiniVisual spec={entry.sampleSpec} width={132} />
                </View>
              ) : null}

              {locked ? (
                <Text variant="caption" color={theme.colors.textMuted}>
                  {entry.lockReason ?? 'Termine le monde précédent pour débloquer.'}
                </Text>
              ) : entry.guided ? (
                <View style={styles.worldProgress}>
                  <ProgressBar value={entry.progress} accessibilityLabel={`Progression du module ${entry.world.title}`} />
                  <Text variant="caption" color={theme.colors.textMuted}>
                    Module guidé · {Math.round(entry.progress * 100)} %
                  </Text>
                </View>
              ) : entry.conceptCount > 0 ? (
                <View style={styles.worldProgress}>
                  <ProgressBar value={entry.progress} accessibilityLabel={`${entry.exploredCount} sur ${entry.conceptCount} fiches`} />
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {entry.exploredCount}/{entry.conceptCount} fiche{entry.conceptCount > 1 ? 's' : ''} consultée{entry.conceptCount > 1 ? 's' : ''}
                  </Text>
                </View>
              ) : (
                <Text variant="caption" color={theme.colors.textMuted}>Contenu à venir</Text>
              )}
            </Card>
          </Pressable>
        </View>
      </View>

      {milestone ? (
        <View style={styles.milestone}>
          <TrademyIcon name="target" size={16} color={theme.colors.reward} />
          <Text variant="caption" color={theme.colors.reward}>
            Palier — {milestone}
          </Text>
        </View>
      ) : null}
    </>
  );
}

const RAIL_W = 52;
const styles = StyleSheet.create({
  headerMascot: { alignItems: 'center' },
  progressBlock: { gap: theme.spacing.xs },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md, marginTop: theme.spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  flex1: { flex: 1 },
  trail: { marginTop: theme.spacing.sm },
  bandHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.sm, marginBottom: theme.spacing.sm },
  bandLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  trailRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'stretch' },
  rail: { width: RAIL_W, alignItems: 'center' },
  connector: { width: 3, flex: 1, minHeight: theme.spacing.md, backgroundColor: 'transparent', borderRadius: 2 },
  badge: { width: RAIL_W, height: RAIL_W, borderRadius: RAIL_W / 2, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  labelWrap: { flex: 1, marginBottom: theme.spacing.md },
  worldCard: { borderWidth: 1.5, gap: theme.spacing.xs },
  worldHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  worldVisual: { alignItems: 'center', marginTop: theme.spacing.xs },
  worldProgress: { gap: 2 },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginLeft: RAIL_W + theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
