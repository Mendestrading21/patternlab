import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { DEMO_SKILL, DEMO_EXERCISES } from '@/data';

const FORMAT_LABELS: Record<string, string> = {
  mcq: 'Choix multiple',
  true_false: 'Vrai / Faux',
  numeric: 'Numérique',
  order: 'Mise en ordre',
  match: 'Association',
  find_error: 'Trouve l’erreur',
  identify_pattern: 'Reconnaissance',
};

export default function Quiz() {
  const router = useRouter();
  const formats = [...new Set(DEMO_EXERCISES.map((e) => e.type))];

  return (
    <Screen>
      <Text variant="h1">Quiz éclair 🎯</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Une session de {DEMO_EXERCISES.length} exercices variés sur « {DEMO_SKILL.name} ».
      </Text>

      <Card>
        <Text variant="title">Formats de cette session</Text>
        <View style={styles.formats}>
          {formats.map((f) => (
            <Chip key={f} label={FORMAT_LABELS[f] ?? f} color={theme.colors.primary} />
          ))}
        </View>
      </Card>

      <CharacterScene
        character="toto"
        state="explain"
        speech="Chaque bonne réponse te donne de l’XP. On explique toujours pourquoi !"
      />

      <Button
        label="Commencer la session"
        onPress={() => router.push(`/session/${DEMO_SKILL.id}`)}
        accessibilityHint="Lancer les exercices"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  formats: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
});
