import { useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, Chip, ProgressBar, StateView, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { MiniVisual } from '@/engines/visual';
import {
  WORLDS,
  V5_CONCEPTS,
  buildLearningPath,
  worldsOpen,
  worldsDone,
  useProgress,
  type WorldEntry,
  type WorldStatus,
} from '@/data';

/**
 * Parcours — chemin UNIQUE (Learning-Master Lot 2). Une seule hiérarchie Monde → Module →
 * Compétence : la page rend un chemin vertical des 15 mondes. Chaque monde ouvre son détail
 * (`/monde/[id]`) ; le déblocage est fondé sur la maîtrise (checkpoint du monde guidé, ou toutes
 * les fiches consultées pour un monde de contenu), plus sur la simple visite.
 */
const WORLD_COLORS: Record<WorldStatus, string> = {
  done: theme.colors.primary,
  current: theme.colors.primaryBright,
  unlocked: theme.colors.technical,
  locked: theme.colors.textMuted,
};

/** Jalons (« paliers ») affichés après certains mondes. */
const MILESTONES: Record<number, string> = {
  3: 'Palier — Fondations posées 🎯',
  7: 'Palier — Tu lis le prix 📈',
  11: 'Palier — Concepts avancés 🧠',
  15: 'Palier — Tour complet des mondes 🏆',
};

function worldIcon(entry: WorldEntry): string {
  if (entry.status === 'locked') return '🔒';
  if (entry.status === 'done') return '✓';
  return String(entry.world.order);
}

export default function Parcours() {
  const router = useRouter();
  const { state, ready } = useProgress();

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On déroule ta carte…" />
      </Screen>
    );
  }

  const path = buildLearningPath(WORLDS, V5_CONCEPTS, {
    completedSkills: state.completedSkills,
    exploredSlugs: state.learning?.conceptsExplored ?? [],
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
        Un seul chemin : gravis un monde à la fois. Chaque monde s’ouvre quand tu as terminé le
        précédent.
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

      <View style={styles.trail}>
        {path.map((entry) => (
          <WorldNode key={entry.world.id} entry={entry} onOpen={() => router.push(`/monde/${entry.world.id}`)} />
        ))}
      </View>
    </Screen>
  );
}

function WorldNode({ entry, onOpen }: { entry: WorldEntry; onOpen: () => void }) {
  const color = WORLD_COLORS[entry.status];
  const locked = entry.status === 'locked';
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
          <View style={[styles.badge, { borderColor: color, backgroundColor: entry.status === 'done' ? color : theme.colors.surface }]}>
            <Text variant="label" color={entry.status === 'done' ? theme.colors.onPrimary : color}>
              {worldIcon(entry)}
            </Text>
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
                {entry.status === 'done' ? (
                  <Chip label="terminé ✓" color={theme.colors.primary} />
                ) : entry.status === 'current' ? (
                  <Chip label="en cours" color={theme.colors.primaryBright} />
                ) : entry.guided ? (
                  <Chip label="guidé" color={theme.colors.technical} />
                ) : locked ? (
                  <Chip label="🔒" color={theme.colors.textMuted} />
                ) : null}
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
          <Text variant="caption" color={theme.colors.reward} center>
            {milestone}
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
  flex1: { flex: 1 },
  trail: { marginTop: theme.spacing.sm },
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
    marginLeft: RAIL_W + theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
