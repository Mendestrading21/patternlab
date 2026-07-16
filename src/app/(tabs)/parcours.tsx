import { useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, theme } from '@/design-system';
import { DEMO_LESSONS } from '@/data';

type NodeStatus = 'done' | 'current' | 'locked';

export default function Parcours() {
  const router = useRouter();

  const nodes: { id: string; title: string; status: NodeStatus }[] = [
    { id: DEMO_LESSONS[0].id, title: DEMO_LESSONS[0].title, status: 'current' },
    { id: DEMO_LESSONS[1].id, title: DEMO_LESSONS[1].title, status: 'locked' },
    { id: 'node.supports', title: 'Supports & résistances', status: 'locked' },
    { id: 'node.patterns', title: 'Premiers patterns', status: 'locked' },
  ];

  return (
    <Screen>
      <Text variant="h1">Ton parcours 🗺️</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Gravis la montagne « Lire un graphique », une étape à la fois.
      </Text>

      <View style={styles.path}>
        {nodes.map((node, i) => {
          const color =
            node.status === 'done'
              ? theme.colors.primary
              : node.status === 'current'
                ? theme.colors.primaryBright
                : theme.colors.textMuted;
          const isLocked = node.status === 'locked';
          return (
            <Pressable
              key={node.id}
              disabled={isLocked}
              accessibilityRole="button"
              accessibilityState={{ disabled: isLocked }}
              accessibilityHint={isLocked ? 'Étape à débloquer' : 'Ouvrir cette étape'}
              onPress={() => !isLocked && router.push(`/lesson/${node.id}`)}
            >
              <Card style={[styles.node, { borderColor: color }]}>
                <View style={[styles.badge, { borderColor: color }]}>
                  <Text variant="title" color={color}>
                    {node.status === 'locked' ? '🔒' : node.status === 'done' ? '✓' : String(i + 1)}
                  </Text>
                </View>
                <View style={styles.nodeText}>
                  <Text variant="title">{node.title}</Text>
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {node.status === 'current'
                      ? 'Prochaine étape'
                      : node.status === 'locked'
                        ? 'Verrouillé — termine l’étape précédente'
                        : 'Terminé'}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  path: { gap: theme.spacing.md },
  node: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1.5 },
  badge: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: { flex: 1, gap: 2 },
});
