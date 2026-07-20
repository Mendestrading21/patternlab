import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Flashcard, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import { PatternChart, generateCandles } from '@/engines/pattern';
import { VisualCard } from '@/engines/visual';
import { conceptBySlug, V5_CONCEPTS } from '@/data';
import type { LessonStep, LessonStepKind } from '@/engines/learning';

type Meta = { label: string; color: string; accent?: string };

/** Métadonnées d'affichage par type d'étape de leçon (label + couleur sémantique). */
export const STEP_META: Record<LessonStepKind, Meta> = {
  intro: { label: '✨ Pour commencer', color: theme.colors.primaryBright },
  explain: { label: 'Explication', color: theme.colors.textMuted },
  observe: { label: '👀 Observe', color: theme.colors.technical },
  example: { label: 'Exemple', color: theme.colors.textMuted },
  chart: { label: '📈 Graphique', color: theme.colors.technical },
  visual: { label: '🕯️ Le visuel', color: theme.colors.technical },
  hypothesis: { label: '⚖️ Hypothèse — Toto / Bobo', color: theme.colors.advanced, accent: theme.colors.advanced },
  interaction: { label: 'À toi', color: theme.colors.primary },
  warning: { label: '⚠️ Attention', color: theme.colors.warning, accent: theme.colors.warning },
  falseSignal: { label: '🚩 Faux signal / limite', color: theme.colors.bearish, accent: theme.colors.bearish },
  summary: { label: '🎯 À retenir', color: theme.colors.primary, accent: theme.colors.primary },
  flashcard: { label: '', color: '' },
};

/**
 * Rendu d'une étape de leçon (texte, flashcard, visuel SVG, graphique bougies, hypothèse Toto/Bobo).
 * Composant partagé entre l'écran leçon (`/lesson/[id]`) et la phase « Apprendre » de la session.
 */
export function LessonStepView({ step }: { step: LessonStep }) {
  const router = useRouter();

  if (step.kind === 'flashcard' && step.flashcard) {
    return <Flashcard front={step.flashcard.front} back={step.flashcard.back} />;
  }

  if (step.kind === 'visual') {
    const concept = step.conceptRef ? conceptBySlug(V5_CONCEPTS, step.conceptRef) : undefined;
    if (concept?.visualSpec) {
      return (
        <View style={styles.stepStack}>
          <VisualCard spec={concept.visualSpec} title={STEP_META.visual.label} />
          {concept.howToRecognize.length ? (
            <Card>
              <Text variant="label" color={theme.colors.textMuted}>
                Comment reconnaître
              </Text>
              {concept.howToRecognize.slice(0, 3).map((r) => (
                <Text key={r} variant="body" color={theme.colors.textSecondary}>
                  • {r}
                </Text>
              ))}
            </Card>
          ) : null}
          <Button
            label="Voir la fiche complète →"
            variant="secondary"
            onPress={() => router.push(`/concept/${concept.slug}`)}
            accessibilityHint={`Ouvrir la fiche ${concept.title}`}
          />
        </View>
      );
    }
    return (
      <Card>
        <Text variant="label" color={theme.colors.technical}>
          {STEP_META.visual.label}
        </Text>
        {step.body ? <Text variant="body">{step.body}</Text> : null}
      </Card>
    );
  }

  if (step.kind === 'hypothesis') {
    const concept = step.conceptRef ? conceptBySlug(V5_CONCEPTS, step.conceptRef) : undefined;
    const bull = concept?.bullishScenario?.conditions?.[0];
    const bear = concept?.bearishScenario?.conditions?.[0] ?? concept?.falseSignals?.[0];
    return (
      <Card style={styles.hypothesis}>
        <Text variant="label" color={theme.colors.advanced}>
          {STEP_META.hypothesis.label}
        </Text>
        {step.body ? (
          <Text variant="body" color={theme.colors.textSecondary}>
            {step.body}
          </Text>
        ) : null}
        <View style={styles.debate}>
          <CharacterScene
            character="toto"
            state="observe"
            size={56}
            speech={bull ? `Hypothèse haussière : ${bull}` : 'Toto formule une hypothèse haussière conditionnelle.'}
          />
          <CharacterScene
            character="bobo"
            state="false-signal"
            size={56}
            reversed
            speech={bear ? `Le risque : ${bear}` : 'Bobo cherche ce qui invaliderait le scénario.'}
          />
        </View>
      </Card>
    );
  }

  if (step.kind === 'chart') {
    return (
      <Card>
        <Text variant="label" color={theme.colors.technical}>
          {STEP_META.chart.label}
        </Text>
        <View style={styles.chart}>
          <PatternChart candles={generateCandles(step.chartSeed ?? 1, 30)} width={300} height={150} />
        </View>
        {step.body ? (
          <Text variant="body" color={theme.colors.textSecondary}>
            {step.body}
          </Text>
        ) : null}
      </Card>
    );
  }

  const meta = STEP_META[step.kind] ?? { label: step.kind, color: theme.colors.textMuted };
  const elevated = step.kind === 'intro';
  return (
    <Card elevated={elevated} style={meta.accent ? { borderColor: meta.accent } : undefined}>
      <Text variant="label" color={meta.color}>
        {meta.label}
      </Text>
      {step.body ? <Text variant="body">{step.body}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: { alignItems: 'center', marginVertical: theme.spacing.md },
  stepStack: { gap: theme.spacing.sm },
  hypothesis: { borderColor: theme.colors.advanced },
  debate: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
});
