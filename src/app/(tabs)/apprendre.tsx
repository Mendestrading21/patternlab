import { useRouter, type Href } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, theme } from '@/design-system';
import { CharacterScene } from '@/characters';

/**
 * Hub « Apprendre » — regroupe le catalogue d'apprentissage libre : leçons, quiz, bibliothèque
 * visuelle, glossaire et laboratoire. Le Laboratoire n'occupe plus un onglet principal ; il devient
 * une modalité forte d'ici. Chaque entrée pointe vers une route réelle (aucun bouton mort).
 */
interface HubEntry {
  icon: string;
  title: string;
  subtitle: string;
  route: Href;
}

const ENTRIES: HubEntry[] = [
  { icon: '📚', title: 'Leçons', subtitle: 'Le module guidé « Lire un graphique ».', route: '/lecons' },
  { icon: '🎯', title: 'Quiz éclair', subtitle: 'Une session d’exercices variés.', route: '/quiz' },
  { icon: '🔍', title: 'Quiz visuel', subtitle: 'Reconnais les figures à l’image.', route: '/reconnaissance' },
  { icon: '🖼️', title: 'Bibliothèque visuelle', subtitle: 'Toutes les figures illustrées, par famille.', route: '/bibliotheque-visuelle' },
  { icon: '📖', title: 'Glossaire', subtitle: 'Le vocabulaire des marchés, avec fiches.', route: '/glossaire' },
  { icon: '🧪', title: 'Laboratoire', subtitle: 'Manipule des graphiques et des scénarios.', route: '/laboratoire' },
];

export default function Apprendre() {
  const router = useRouter();

  return (
    <Screen>
      <Text variant="h1">Apprendre 📚</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Explore à ton rythme : leçons, quiz, figures illustrées, glossaire et laboratoire.
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
              <Text variant="h2">{e.icon}</Text>
              <View style={styles.entryText}>
                <Text variant="title">{e.title}</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {e.subtitle}
                </Text>
              </View>
              <Text variant="title" color={theme.colors.textMuted}>
                ›
              </Text>
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
  entryText: { flex: 1, gap: 2 },
});
