import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, Chip, ProgressBar, StateView, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { MiniVisual } from '@/engines/visual';
import {
  SKILLS,
  PILOT_MODULE,
  useProgress,
  buildWorldMap,
  buildWorldPath,
  worldsUnlocked,
  conceptSlugForSkill,
  WORLDS,
  V5_CONCEPTS,
  type MapNode,
  type NodeStatus,
  type WorldPathNode,
  type WorldNodeStatus,
} from '@/data';
import { summarizeConcepts, coverageTotals } from '@/content/coverage';
import { analytics } from '@/analytics';

const COLORS: Record<NodeStatus, string> = {
  done: theme.colors.primary,
  due: theme.colors.warning,
  current: theme.colors.primaryBright,
  locked: theme.colors.textMuted,
};

function iconFor(node: MapNode): string {
  if (node.status === 'locked') return '🔒';
  if (node.kind === 'checkpoint') return node.status === 'done' ? '🎉' : '🏁';
  if (node.status === 'done') return '✓';
  if (node.status === 'due') return '🔁';
  return String(node.index + 1);
}

function labelFor(node: MapNode): string {
  if (node.kind === 'checkpoint') {
    if (node.status === 'locked') return 'Termine les 4 compétences pour débloquer la revue';
    if (node.status === 'done') return 'Module validé 🎉';
    return 'Prêt — revois tout le module';
  }
  switch (node.status) {
    case 'done': return 'Terminé ✓';
    case 'due': return 'À réviser — la répétition espacée la ramène';
    case 'current': return 'Prochaine étape';
    default: return 'Verrouillé — termine l’étape précédente';
  }
}

export default function Parcours() {
  const router = useRouter();
  const { state, ready } = useProgress();

  // Hooks avant tout retour anticipé (règle des Hooks). Données dérivées entièrement statiques
  // (WORLDS / V5_CONCEPTS sont des constantes de module) : calculées une seule fois.
  const content = useMemo(() => coverageTotals(summarizeConcepts(V5_CONCEPTS)), []);
  const nextMilestone = content.milestones[0];

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On déroule ta carte…" />
      </Screen>
    );
  }

  const map = buildWorldMap(state, SKILLS, PILOT_MODULE.title, Date.now());
  const path = buildWorldPath(WORLDS, V5_CONCEPTS, state.learning?.conceptsExplored ?? []);
  const unlockedCount = worldsUnlocked(path);

  const openWorld = (worldId: string, slug: string | null) => {
    if (!slug) return;
    analytics.track('world_opened', { worldId });
    router.push(`/concept/${slug}`);
  };

  return (
    <Screen>
      <Text variant="label" color={theme.colors.technical}>
        {map.worldTitle.toUpperCase()}
      </Text>
      <Text variant="h1">{map.moduleTitle} 🗺️</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Gravis la carte, une compétence à la fois, jusqu’à la revue du module.
      </Text>

      <View style={styles.headerMascot}>
        <MascotFigure name="toto-present" height={104} />
      </View>
      <View style={styles.progressBlock}>
        <ProgressBar value={map.completed / map.total} accessibilityLabel={`${map.completed} sur ${map.total} étapes`} />
        <Text variant="caption" color={theme.colors.textMuted}>
          {map.completed} / {map.total} étapes franchies
        </Text>
      </View>

      <View style={styles.trail}>
        {map.nodes.map((node) => {
          const color = COLORS[node.status];
          const locked = node.status === 'locked';
          const reached = node.status !== 'locked';
          // Fiche concept liée (avec visuel) — accessible librement, comme la carte des mondes.
          const conceptSlug = node.kind === 'skill' ? conceptSlugForSkill(node.id) : undefined;
          return (
            <View key={node.id} style={styles.trailRow}>
              <View style={styles.rail}>
                {node.index > 0 ? (
                  <View style={[styles.connector, { backgroundColor: reached ? color : theme.colors.border }]} />
                ) : (
                  <View style={styles.connector} />
                )}
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: color,
                      backgroundColor: node.status === 'done' ? color : theme.colors.surface,
                    },
                  ]}
                >
                  <Text variant="title" color={node.status === 'done' ? theme.colors.onPrimary : color}>
                    {iconFor(node)}
                  </Text>
                </View>
              </View>

              <View style={styles.labelWrap}>
                <Pressable
                  disabled={locked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: locked }}
                  accessibilityHint={locked ? 'Étape verrouillée' : 'Ouvrir cette étape'}
                  onPress={() => !locked && router.push(`/session/${node.id}`)}
                >
                  <Card style={[styles.labelCard, { borderColor: reached ? color : theme.colors.border }]}>
                    <View style={styles.labelHead}>
                      <Text variant="title" style={styles.flex1}>
                        {node.title}
                      </Text>
                      {node.status === 'due' ? <Chip label="à réviser" color={theme.colors.warning} /> : null}
                      {node.kind === 'checkpoint' && node.status === 'current' ? (
                        <Chip label="revue" color={theme.colors.technical} />
                      ) : null}
                    </View>
                    <Text variant="caption" color={theme.colors.textMuted}>
                      {labelFor(node)}
                    </Text>
                  </Card>
                </Pressable>
                {conceptSlug ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityHint={`Découvrir la notion liée à ${node.title}`}
                    onPress={() => router.push(`/concept/${conceptSlug}`)}
                    style={styles.discover}
                  >
                    <Text variant="caption" color={theme.colors.technical}>
                      Découvrir la notion ›
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <Text variant="h2" style={styles.worldsHeader}>
        🗺️ La carte des mondes
      </Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Gravis les {WORLDS.length} mondes de PatternLab, un palier à la fois.
      </Text>
      <Text variant="caption" color={theme.colors.textMuted}>
        {unlockedCount}/{WORLDS.length} mondes débloqués · explore un monde pour ouvrir le suivant
      </Text>

      <Card style={styles.contentCard}>
        <View style={styles.labelHead}>
          <Text variant="title" style={styles.flex1}>
            Progression du contenu
          </Text>
          <Chip label={`${content.total} / ${nextMilestone.target}`} color={theme.colors.technical} />
        </View>
        <ProgressBar value={nextMilestone.pct / 100} accessibilityLabel={`${content.total} concepts sur ${nextMilestone.target}`} />
        <Text variant="caption" color={theme.colors.textMuted}>
          {content.total} concepts en revue · objectif {nextMilestone.target} ({nextMilestone.pct} %), puis {content.milestones[1].target}+
        </Text>
      </Card>

      <View style={styles.trail}>
        {path.map((node) => (
          <WorldNode
            key={node.world.id}
            node={node}
            onOpen={() => openWorld(node.world.id, node.firstConceptSlug)}
          />
        ))}
      </View>
    </Screen>
  );
}

// ─── Nœud de monde (chemin vertical vivant) ──────────────────────────
const WORLD_COLORS: Record<WorldNodeStatus, string> = {
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

function worldIcon(node: WorldPathNode): string {
  if (node.status === 'locked') return '🔒';
  if (node.status === 'done') return '✓';
  return String(node.world.order);
}

function WorldNode({ node, onOpen }: { node: WorldPathNode; onOpen: () => void }) {
  const color = WORLD_COLORS[node.status];
  const locked = node.status === 'locked';
  const openable = !locked && Boolean(node.firstConceptSlug);
  const milestone = MILESTONES[node.world.order];

  return (
    <>
      <View style={styles.trailRow}>
        <View style={styles.rail}>
          {node.world.order > 1 ? (
            <View style={[styles.connector, { backgroundColor: locked ? theme.colors.border : color }]} />
          ) : (
            <View style={styles.connector} />
          )}
          <View style={[styles.badge, { borderColor: color, backgroundColor: node.status === 'done' ? color : theme.colors.surface }]}>
            <Text variant="label" color={node.status === 'done' ? theme.colors.onPrimary : color}>
              {worldIcon(node)}
            </Text>
          </View>
        </View>

        <View style={styles.labelWrap}>
          <Pressable
            disabled={!openable}
            accessibilityRole="button"
            accessibilityState={{ disabled: !openable }}
            accessibilityHint={openable ? `Ouvrir le monde ${node.world.title}` : 'Explore le monde précédent pour débloquer'}
            onPress={onOpen}
          >
            <Card style={[styles.worldCard, { borderColor: locked ? theme.colors.border : color }]}>
              <View style={styles.worldHead}>
                <View style={styles.flex1}>
                  <Text variant="title" color={locked ? theme.colors.textMuted : theme.colors.textPrimary}>
                    {node.world.title}
                  </Text>
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {node.world.subtitle}
                  </Text>
                </View>
                {node.status === 'done' ? (
                  <Chip label="terminé ✓" color={theme.colors.primary} />
                ) : node.status === 'current' ? (
                  <Chip label="à explorer" color={theme.colors.primaryBright} />
                ) : locked ? (
                  <Chip label="🔒" color={theme.colors.textMuted} />
                ) : null}
              </View>

              {!locked && node.sampleSpec ? (
                <View style={styles.worldVisual}>
                  <MiniVisual spec={node.sampleSpec} width={132} />
                </View>
              ) : null}

              {node.conceptCount > 0 ? (
                <View style={styles.worldProgress}>
                  <ProgressBar
                    value={node.progress}
                    accessibilityLabel={`${node.exploredCount} concept sur ${node.conceptCount} exploré`}
                  />
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {node.exploredCount}/{node.conceptCount} concept{node.conceptCount > 1 ? 's' : ''} exploré{node.conceptCount > 1 ? 's' : ''}
                  </Text>
                </View>
              ) : null}
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
  badge: {
    width: RAIL_W,
    height: RAIL_W,
    borderRadius: RAIL_W / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: { flex: 1, marginBottom: theme.spacing.md },
  labelCard: { borderWidth: 1.5, gap: 2 },
  discover: { paddingVertical: theme.spacing.xs, paddingLeft: theme.spacing.xs, marginTop: theme.spacing.xs },
  labelHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  worldsHeader: { marginTop: theme.spacing.lg },
  contentCard: { gap: theme.spacing.sm, marginTop: theme.spacing.xs, marginBottom: theme.spacing.sm },
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
