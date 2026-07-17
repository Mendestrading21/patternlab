import { useRouter } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Screen, Text, Card, theme } from '@/design-system';
import { SKILLS, useProgress } from '@/data';

type NodeStatus = 'done' | 'current' | 'locked';

export default function Parcours() {
  const router = useRouter();
  const { state } = useProgress();
  const completed = state?.completedSkills ?? [];
  const firstIncomplete = SKILLS.findIndex((s) => !completed.includes(s.id));

  const statusOf = (index: number, id: string): NodeStatus => {
    if (completed.includes(id)) return 'done';
    if (firstIncomplete === index) return 'current';
    return 'locked';
  };

  return (
    <Screen>
      <Text variant="h1">Ton parcours 🗺️</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Module « Lire un graphique » — gravis la montagne, une compétence à la fois.
      </Text>

      <View style={styles.path}>
        {SKILLS.map((skill, i) => {
          const status = statusOf(i, skill.id);
          const color =
            status === 'done'
              ? theme.colors.primary
              : status === 'current'
                ? theme.colors.primaryBright
                : theme.colors.textMuted;
          const locked = status === 'locked';
          return (
            <Pressable
              key={skill.id}
              disabled={locked}
              accessibilityRole="button"
              accessibilityState={{ disabled: locked }}
              accessibilityHint={locked ? 'Termine la compétence précédente' : 'Ouvrir cette compétence'}
              onPress={() => !locked && router.push(`/session/${skill.id}`)}
            >
              <Card style={[styles.node, { borderColor: color }]}>
                <View style={[styles.badge, { borderColor: color }]}>
                  <Text variant="title" color={color}>
                    {status === 'locked' ? '🔒' : status === 'done' ? '✓' : String(i + 1)}
                  </Text>
                </View>
                <View style={styles.nodeText}>
                  <Text variant="title">{skill.name}</Text>
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {status === 'current'
                      ? 'Prochaine étape'
                      : status === 'done'
                        ? 'Terminé ✓'
                        : 'Verrouillé — termine l’étape précédente'}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Text variant="caption" color={theme.colors.textMuted} center>
        {completed.length} / {SKILLS.length} compétences terminées
      </Text>
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
