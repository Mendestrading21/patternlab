import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, Chip, ProgressBar, StateView, Button, theme } from '@/design-system';
import { CharacterScene, MascotFigure } from '@/characters';
import { MiniVisual } from '@/engines/visual';
import {
  WORLDS,
  V5_CONCEPTS,
  conceptsByWorld,
  buildLearningPath,
  worldEntryById,
  guidedModulesForWorld,
  buildWorldMap,
  SKILLS,
  conceptSlugForSkill,
  useProgress,
  type MapNode,
  type NodeStatus,
} from '@/data';
import { analytics } from '@/analytics';

const NODE_COLORS: Record<NodeStatus, string> = {
  done: theme.colors.primary,
  due: theme.colors.warning,
  current: theme.colors.primaryBright,
  locked: theme.colors.textMuted,
};

function nodeIcon(node: MapNode): string {
  if (node.status === 'locked') return '🔒';
  if (node.kind === 'checkpoint') return node.status === 'done' ? '🎉' : '🏁';
  if (node.status === 'done') return '✓';
  if (node.status === 'due') return '🔁';
  return String(node.index + 1);
}

function nodeLabel(node: MapNode): string {
  if (node.kind === 'checkpoint') {
    if (node.status === 'locked') return 'Termine les compétences pour débloquer la revue';
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

export default function WorldDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, ready } = useProgress();

  const worldId = typeof id === 'string' ? id : '';
  const world = WORLDS.find((w) => w.id === worldId);

  useEffect(() => {
    if (world) analytics.track('world_opened', { worldId });
    else if (worldId) analytics.track('session_not_found', { requested: `monde:${worldId}` });
  }, [world, worldId]);

  if (!ready || !state) {
    return (
      <Screen>
        <StateView variant="loading" title="On ouvre le monde…" />
      </Screen>
    );
  }

  // Monde inexistant → état explicite (aucun repli silencieux).
  if (!world) {
    return (
      <Screen>
        <Text variant="caption" color={theme.colors.textMuted}>MONDE</Text>
        <Text variant="h2">Monde introuvable</Text>
        <CharacterScene character="bobo" state="review" size={60} speech="Ce monde n’existe pas. Reviens au parcours." />
        <Button label="Voir le parcours" onPress={() => router.replace('/parcours')} />
      </Screen>
    );
  }

  const path = buildLearningPath(WORLDS, V5_CONCEPTS, {
    completedSkills: state.completedSkills,
    exploredSlugs: state.learning?.conceptsExplored ?? [],
  });
  const entry = worldEntryById(path, worldId);
  const locked = entry?.status === 'locked';
  const guidedModules = guidedModulesForWorld(worldId);
  const concepts = conceptsByWorld(V5_CONCEPTS, worldId);

  const header = (
    <>
      <Text variant="label" color={theme.colors.technical}>
        MONDE {world.order} / {WORLDS.length}
      </Text>
      <Text variant="h1">{world.title}</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {world.subtitle}
      </Text>
    </>
  );

  // Monde verrouillé → raison + retour, sans dévoiler le contenu.
  if (locked) {
    return (
      <Screen>
        {header}
        <CharacterScene
          character="bobo"
          state="review"
          size={60}
          speech="Ce monde est encore verrouillé."
        />
        <Card>
          <Text variant="body" color={theme.colors.textSecondary}>
            {entry?.lockReason ?? 'Termine le monde précédent pour débloquer celui-ci.'}
          </Text>
        </Card>
        <Button label="Voir le parcours" onPress={() => router.replace('/parcours')} />
      </Screen>
    );
  }

  return (
    <Screen>
      {header}

      {entry ? (
        <View style={styles.progressBlock}>
          <ProgressBar value={entry.progress} accessibilityLabel={`Progression du monde ${world.title}`} />
          <Text variant="caption" color={theme.colors.textMuted}>
            {entry.guided
              ? entry.status === 'done'
                ? 'Module validé ✓'
                : 'Avance dans le module guidé ci-dessous.'
              : `${entry.exploredCount}/${entry.conceptCount} fiche${entry.conceptCount > 1 ? 's' : ''} consultée${entry.conceptCount > 1 ? 's' : ''}`}
          </Text>
        </View>
      ) : null}

      {guidedModules.length > 0 ? (
        <GuidedModuleView
          moduleTitle={guidedModules[0].title}
          onOpenNode={(nodeId, isLocked) => !isLocked && router.push(`/session/${nodeId}`)}
          onDiscover={(slug) => router.push(`/concept/${slug}`)}
        />
      ) : concepts.length > 0 ? (
        <>
          <View style={styles.headerMascot}>
            <MascotFigure name="toto-present" height={96} decorative />
          </View>
          <Text variant="h2">Notions de ce monde</Text>
          <Text variant="caption" color={theme.colors.textMuted}>
            Consulte chaque fiche illustrée. Les leçons guidées de ce monde arriveront dans un prochain lot.
          </Text>
          <View style={styles.conceptList}>
            {concepts.map((c) => (
              <Pressable
                key={c.slug}
                accessibilityRole="button"
                accessibilityHint={`Ouvrir la fiche ${c.title}`}
                onPress={() => router.push(`/concept/${c.slug}`)}
              >
                <Card style={styles.conceptRow}>
                  {c.visualSpec ? <MiniVisual spec={c.visualSpec} width={96} /> : null}
                  <View style={styles.conceptText}>
                    <Text variant="title">{c.title}</Text>
                    <Text variant="caption" color={theme.colors.textSecondary}>
                      {c.definitionShort}
                    </Text>
                  </View>
                  <Text variant="title" color={theme.colors.textMuted}>›</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <Card>
          <Text variant="body" color={theme.colors.textSecondary}>
            Le contenu de ce monde arrive bientôt. En attendant, explore la bibliothèque visuelle et le
            glossaire depuis l’onglet Apprendre.
          </Text>
        </Card>
      )}
    </Screen>
  );
}

/** Module guidé (monde 1) : trail des compétences + checkpoint, dérivé de la progression réelle. */
function GuidedModuleView({
  moduleTitle,
  onOpenNode,
  onDiscover,
}: {
  moduleTitle: string;
  onOpenNode: (nodeId: string, locked: boolean) => void;
  onDiscover: (slug: string) => void;
}) {
  const { state } = useProgress();
  if (!state) return null;
  const map = buildWorldMap(state, SKILLS, moduleTitle, Date.now());

  return (
    <>
      <View style={styles.headerMascot}>
        <MascotFigure name="toto-present" height={96} decorative />
      </View>
      <Text variant="h2">Module : {moduleTitle}</Text>
      <View style={styles.trail}>
        {map.nodes.map((node) => {
          const color = NODE_COLORS[node.status];
          const locked = node.status === 'locked';
          const reached = node.status !== 'locked';
          const conceptSlug = node.kind === 'skill' ? conceptSlugForSkill(node.id) : undefined;
          return (
            <View key={node.id} style={styles.trailRow}>
              <View style={styles.rail}>
                {node.index > 0 ? (
                  <View style={[styles.connector, { backgroundColor: reached ? color : theme.colors.border }]} />
                ) : (
                  <View style={styles.connector} />
                )}
                <View style={[styles.badge, { borderColor: color, backgroundColor: node.status === 'done' ? color : theme.colors.surface }]}>
                  <Text variant="title" color={node.status === 'done' ? theme.colors.onPrimary : color}>
                    {nodeIcon(node)}
                  </Text>
                </View>
              </View>
              <View style={styles.labelWrap}>
                <Pressable
                  disabled={locked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: locked }}
                  accessibilityHint={locked ? 'Étape verrouillée' : 'Ouvrir cette étape'}
                  onPress={() => onOpenNode(node.id, locked)}
                >
                  <Card style={[styles.labelCard, { borderColor: reached ? color : theme.colors.border }]}>
                    <View style={styles.labelHead}>
                      <Text variant="title" style={styles.flex1}>{node.title}</Text>
                      {node.status === 'due' ? <Chip label="à réviser" color={theme.colors.warning} /> : null}
                      {node.kind === 'checkpoint' && node.status === 'current' ? (
                        <Chip label="revue" color={theme.colors.technical} />
                      ) : null}
                    </View>
                    <Text variant="caption" color={theme.colors.textMuted}>{nodeLabel(node)}</Text>
                  </Card>
                </Pressable>
                {conceptSlug ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityHint={`Découvrir la notion liée à ${node.title}`}
                    onPress={() => onDiscover(conceptSlug)}
                    style={styles.discover}
                  >
                    <Text variant="caption" color={theme.colors.technical}>Découvrir la notion ›</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}

const RAIL_W = 52;
const styles = StyleSheet.create({
  progressBlock: { gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  headerMascot: { alignItems: 'center', marginTop: theme.spacing.sm },
  trail: { marginTop: theme.spacing.sm },
  trailRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'stretch' },
  rail: { width: RAIL_W, alignItems: 'center' },
  connector: { width: 3, flex: 1, minHeight: theme.spacing.md, backgroundColor: 'transparent', borderRadius: 2 },
  badge: { width: RAIL_W, height: RAIL_W, borderRadius: RAIL_W / 2, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  labelWrap: { flex: 1, marginBottom: theme.spacing.md },
  labelCard: { borderWidth: 1.5, gap: 2 },
  labelHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  discover: { paddingVertical: theme.spacing.xs, paddingLeft: theme.spacing.xs, marginTop: theme.spacing.xs },
  flex1: { flex: 1 },
  conceptList: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  conceptRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  conceptText: { flex: 1, gap: 2 },
});
