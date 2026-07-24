import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  Screen,
  Text,
  Card,
  Chip,
  StateView,
  Button,
  TrademyIcon,
  MarketStatePill,
  MARKET_STATE_ORDER,
  ProgressWidget,
  theme,
  type TrademyIconName,
} from '@/design-system';
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
import { useNow } from '@/lib/useNow';

/**
 * Pré-génère un HTML concret par monde connu. GitHub Pages sert alors `monde/world.*.html`
 * directement (au lieu du repli `404.html`), supprimant toute divergence d'hydratation sur les liens
 * directs vers un monde (même garde-fou que les routes `session`/`lesson` du LOT 3).
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return WORLDS.map((w) => ({ id: w.id }));
}

const NODE_COLORS: Record<NodeStatus, string> = {
  done: theme.colors.primary,
  due: theme.colors.warning,
  current: theme.colors.primaryBright,
  locked: theme.colors.textMuted,
};

/** Glyphe de nœud dans la famille d'icônes Trademy (plus d'emoji système en substitut). */
function nodeGlyph(node: MapNode): { icon?: TrademyIconName; text?: string } {
  if (node.status === 'locked') return { icon: 'lock' };
  if (node.kind === 'checkpoint') return { icon: node.status === 'done' ? 'trophy' : 'checkpoint' };
  if (node.status === 'done') return { icon: 'check' };
  if (node.status === 'due') return { icon: 'review' };
  return { text: String(node.index + 1) };
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
          <ProgressWidget
            title={world.title}
            value={entry.progress}
            accent={theme.colors.primary}
            caption={
              entry.guided
                ? entry.status === 'done'
                  ? 'Module validé'
                  : 'Avance dans le module guidé ci-dessous.'
                : `${entry.exploredCount}/${entry.conceptCount} fiche${entry.conceptCount > 1 ? 's' : ''} consultée${entry.conceptCount > 1 ? 's' : ''}`
            }
          />
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
  const now = useNow();
  if (!state) return null;
  const map = buildWorldMap(state, SKILLS, moduleTitle, now);

  return (
    <>
      <View style={styles.headerMascot}>
        <MascotFigure name="toto-present" height={96} decorative />
      </View>
      <Text variant="h2">Module : {moduleTitle}</Text>

      {/* Légende pédagogique des états de marché — repères visuels réutilisés dans les leçons.
          Informatif, non interactif : ne révèle aucune réponse. Vocabulaire éducatif uniquement. */}
      <Card style={styles.legendCard}>
        <Text variant="label" color={theme.colors.textSecondary}>
          Repères de marché enseignés
        </Text>
        <View style={styles.legend}>
          {MARKET_STATE_ORDER.map((s) => (
            <MarketStatePill key={s} state={s} />
          ))}
        </View>
        <Text variant="caption" color={theme.colors.textMuted}>
          Vocabulaire éducatif : setup, confirmation, invalidation, faux signal — jamais un ordre.
        </Text>
      </Card>

      <View style={styles.trail}>
        {map.nodes.map((node) => {
          const color = NODE_COLORS[node.status];
          const locked = node.status === 'locked';
          const reached = node.status !== 'locked';
          const conceptSlug = node.kind === 'skill' ? conceptSlugForSkill(node.id) : undefined;
          const glyph = nodeGlyph(node);
          const glyphColor = node.status === 'done' ? theme.colors.onPrimary : color;
          return (
            <View key={node.id} style={styles.trailRow}>
              <View style={styles.rail}>
                {node.index > 0 ? (
                  <View style={[styles.connector, { backgroundColor: reached ? color : theme.colors.border }]} />
                ) : (
                  <View style={styles.connector} />
                )}
                <View style={[styles.badge, { borderColor: color, backgroundColor: node.status === 'done' ? color : theme.colors.surface }]}>
                  {glyph.icon ? (
                    <TrademyIcon name={glyph.icon} size={22} color={glyphColor} strokeWidth={2.2} />
                  ) : (
                    <Text variant="title" color={glyphColor}>
                      {glyph.text}
                    </Text>
                  )}
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
  legendCard: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
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
