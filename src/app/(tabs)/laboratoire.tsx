import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { PatternChart, generateCandles } from '@/engines/pattern';
import { DEMO_PATTERN } from '@/data';

export default function Laboratoire() {
  const router = useRouter();
  const candles = generateCandles(2024, 30);
  const bullish = DEMO_PATTERN.direction === 'bullish';

  return (
    <Screen>
      <Text variant="h1">Laboratoire 🧪</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Observe un graphique et repère la figure. Ici, tout est un scénario pédagogique —
        aucun conseil, aucun signal.
      </Text>

      <Card elevated>
        <View style={styles.chartHead}>
          <Text variant="title">{DEMO_PATTERN.name}</Text>
          <Chip
            label={bullish ? 'Setup haussier' : 'Setup baissier'}
            color={bullish ? theme.colors.bullish : theme.colors.bearish}
          />
        </View>
        <Text variant="caption" color={theme.colors.textMuted}>
          Chandeliers · données de démonstration déterministes
        </Text>
        <View style={styles.chart}>
          <PatternChart candles={candles} width={320} height={170} />
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          {DEMO_PATTERN.definition}
        </Text>
      </Card>

      <Card>
        <Text variant="label" color={theme.colors.technical}>
          🔎 Zone de confirmation
        </Text>
        {DEMO_PATTERN.recognitionRules.map((r) => (
          <Text key={r} variant="body" style={styles.rule}>
            • {r}
          </Text>
        ))}
      </Card>

      <Card style={styles.invalidCard}>
        <Text variant="label" color={theme.colors.bearish}>
          ⚠️ Invalidation / faux signal
        </Text>
        {DEMO_PATTERN.invalidationRules.map((r) => (
          <Text key={r} variant="body" style={styles.rule}>
            • {r}
          </Text>
        ))}
      </Card>

      <View style={styles.debate}>
        <CharacterScene
          character="toto"
          state="explain"
          size={60}
          speech="Deux creux proches, un rebond : hypothèse haussière si la ligne de cou casse."
        />
        <CharacterScene
          character="bobo"
          state="warning"
          size={60}
          reversed
          speech="Et si le prix repasse sous le second creux ? Là, la figure est invalidée."
        />
      </View>

      <Button
        label="Voir la leçon — Le double creux"
        onPress={() => router.push('/lesson/lesson.double-bottom')}
        accessibilityHint="Ouvrir la leçon associée"
      />
      <Button
        label="Tracer & comparer sur le graphique"
        variant="secondary"
        disabled
        disabledReason="Tracé de niveaux, zones et invalidation interactifs : au Lot 8 (laboratoire complet)."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chart: { alignItems: 'center', marginVertical: theme.spacing.md },
  rule: { marginTop: theme.spacing.xs },
  invalidCard: { borderColor: theme.colors.bearish },
  debate: { gap: theme.spacing.md },
});
