import { useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, Chip, ProgressBar, StateView, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import {
  SKILLS,
  PILOT_MODULE,
  useProgress,
  buildWorldMap,
  buildWorldOverview,
  worldsWithContent,
  WORLDS,
  V5_CONCEPTS,
  type MapNode,
  type NodeStatus,
} from '@/data';
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

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On déroule ta carte…" />
      </Screen>
    );
  }

  const map = buildWorldMap(state, SKILLS, PILOT_MODULE.title, Date.now());
  const overview = buildWorldOverview(WORLDS, V5_CONCEPTS);
  const openCount = worldsWithContent(overview);

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

              <Pressable
                style={styles.flex1}
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
            </View>
          );
        })}
      </View>

      <Text variant="h2" style={styles.worldsHeader}>
        🗺️ La carte des mondes
      </Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Au-delà du module pilote, PatternLab se déploie en {overview.length} mondes.
      </Text>
      <Text variant="caption" color={theme.colors.textMuted}>
        {openCount}/{overview.length} mondes ouverts · les autres arrivent (contenu V5 en préparation)
      </Text>

      <View style={styles.worldList}>
        {overview.map((s) => {
          const openable = s.hasContent && Boolean(s.firstConceptSlug);
          return (
            <Pressable
              key={s.world.id}
              disabled={!openable}
              accessibilityRole="button"
              accessibilityState={{ disabled: !openable }}
              accessibilityHint={openable ? `Ouvrir le monde ${s.world.title}` : 'Contenu à venir'}
              onPress={() => openWorld(s.world.id, s.firstConceptSlug)}
            >
              <Card style={[styles.worldCard, openable ? styles.worldCardOpen : null]}>
                <View style={styles.worldHead}>
                  <View style={[styles.worldOrder, openable ? styles.worldOrderOpen : null]}>
                    <Text variant="label" color={openable ? theme.colors.technical : theme.colors.textMuted}>
                      {s.world.order}
                    </Text>
                  </View>
                  <View style={styles.flex1}>
                    <Text variant="title">{s.world.title}</Text>
                    <Text variant="caption" color={theme.colors.textMuted}>
                      {s.world.subtitle}
                    </Text>
                  </View>
                  {s.hasContent ? (
                    <Chip label={`${s.conceptCount} concept${s.conceptCount > 1 ? 's' : ''}`} color={theme.colors.technical} />
                  ) : (
                    <Chip label="à venir" color={theme.colors.textMuted} />
                  )}
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </Screen>
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
  labelCard: { marginBottom: theme.spacing.md, borderWidth: 1.5, gap: 2 },
  labelHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  worldsHeader: { marginTop: theme.spacing.lg },
  worldList: { gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  worldCard: { borderWidth: 1 },
  worldCardOpen: { borderColor: theme.colors.technical },
  worldHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  worldOrder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldOrderOpen: { borderColor: theme.colors.technical },
});
