import { useRouter, type Href } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, TrademyIcon, type TrademyIconName, theme } from '@/design-system';
import { CharacterScene } from '@/characters';

/**
 * Espace « Bibliothèque » (canon Trademy) — la référence : glossaire, figures illustrées,
 * fiches et pratique libre. La recherche/filtres et l'historique arrivent au lot Bibliothèque.
 * Chaque entrée pointe vers une route réelle (aucun bouton mort). Le Laboratoire a désormais son
 * propre onglet ; il n'apparaît plus ici.
 */
interface HubEntry {
  icon: TrademyIconName;
  title: string;
  subtitle: string;
  route: Href;
}

const ENTRIES: HubEntry[] = [
  { icon: 'book', title: 'Glossaire', subtitle: 'Le vocabulaire des marchés, avec fiches.', route: '/glossaire' },
  { icon: 'chart', title: 'Figures illustrées', subtitle: 'Toutes les figures, par famille.', route: '/bibliotheque-visuelle' },
  { icon: 'search', title: 'Quiz visuel', subtitle: 'Reconnais les figures à l’image.', route: '/reconnaissance' },
  { icon: 'play', title: 'Leçons', subtitle: 'Le module guidé « Lire un graphique ».', route: '/lecons' },
  { icon: 'target', title: 'Quiz éclair', subtitle: 'Une session d’exercices variés.', route: '/quiz' },
];

export default function Bibliotheque() {
  const router = useRouter();

  return (
    <Screen>
      <Text variant="h1">Bibliothèque</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Cherche, révise et explore les concepts : glossaire, figures illustrées et pratique libre.
      </Text>

      <CharacterScene
        character="toto"
        state="explain"
        size={60}
        speech="Choisis ce qui t’attire — chaque entrée t’apprend à lire les graphiques."
      />

      <View style={styles.list}>
        {ENTRIES.map((e) => (
          <Pressable
            key={e.title}
            accessibilityRole="button"
            accessibilityHint={`Ouvrir : ${e.title}`}
            onPress={() => router.push(e.route)}
          >
            <Card style={styles.entry}>
              <View style={styles.iconBadge}>
                <TrademyIcon name={e.icon} color={theme.colors.primaryBright} size={22} />
              </View>
              <View style={styles.entryText}>
                <Text variant="title">{e.title}</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {e.subtitle}
                </Text>
              </View>
              <TrademyIcon name="chevron-right" color={theme.colors.textMuted} size={20} />
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  entry: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryText: { flex: 1, gap: 2 },
});
