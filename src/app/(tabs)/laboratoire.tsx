import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, SegmentedControl, TrademyIcon, type SegmentOption, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import {
  InteractiveChart,
  MarketReplayChart,
  generateCandles,
  priceScale,
  supportLevel,
  isLevelClose,
  initReplay,
  stepReplay,
  revealAll,
  resetReplay,
  replayAtEnd,
  replayAtStart,
} from '@/engines/pattern';
import { VisualCard, IndicatorPanel, INDICATOR_LABS, indicatorLabById, datasetByKey } from '@/engines/visual';
import { DEMO_PATTERN, V5_CONCEPTS, CHART_SCENARIOS, chartScenarioById, type VisualSpec } from '@/data';
import { analytics } from '@/analytics';

/** Aperçu du moteur de visuels V5 : anatomie d'une bougie (statique, accessible). */
const ANATOMY_SPEC: VisualSpec = {
  type: 'candle-anatomy',
  variant: 'bullish',
  direction: 'bullish',
  labels: [],
  annotations: [],
  datasetKey: 'candle.anatomy.v1',
  accessibilitySummary:
    'Anatomie d’une bougie : un corps rectangulaire entre l’ouverture et la clôture, prolongé d’une mèche haute et d’une mèche basse.',
};

export default function Laboratoire() {
  const router = useRouter();
  // Séries déterministes (mêmes seeds) : mémorisées pour éviter de régénérer à chaque rendu.
  const candles = useMemo(() => generateCandles(2024, 30), []);
  const scale = useMemo(() => priceScale(candles, 170), [candles]);
  const target = useMemo(() => supportLevel(candles), [candles]);
  const step = scale.range * 0.02;

  const [userPrice, setUserPrice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Scénario 2 — replay bougie par bougie + volume (participation).
  const replayCandles = useMemo(() => generateCandles(777, 24), []);
  const [replay, setReplay] = useState(() => initReplay(replayCandles.length, 6));
  const [replayDone, setReplayDone] = useState(false);

  // Scénario 3 — labs d'indicateurs paramétrables (RSI / MM / Bollinger).
  const [labId, setLabId] = useState(INDICATOR_LABS[0].id);
  const [labParam, setLabParam] = useState<number>(INDICATOR_LABS[0].defaultValue);
  const lab = indicatorLabById(labId) ?? INDICATOR_LABS[0];
  const labCandles = useMemo(() => datasetByKey(lab.datasetKey), [lab.datasetKey]);
  const labConfig = lab.configFor(labParam);
  const labOptions: SegmentOption<string>[] = INDICATOR_LABS.map((l) => ({ id: l.id, label: l.title }));
  const paramOptions: SegmentOption<string>[] = lab.paramValues.map((v) => ({ id: String(v), label: lab.formatValue(v) }));

  // Scénario 0 — lecture guidée : annotations affichables/masquables + révélation progressive.
  const [scenarioId, setScenarioId] = useState(CHART_SCENARIOS[0].id);
  const scenario = chartScenarioById(scenarioId) ?? CHART_SCENARIOS[0];
  const scenarioCandles = useMemo(() => datasetByKey(scenario.datasetKey), [scenario.datasetKey]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [scenReplay, setScenReplay] = useState(() =>
    initReplay(scenarioCandles.length, Math.min(6, scenarioCandles.length)),
  );
  const scenarioOptions: SegmentOption<string>[] = CHART_SCENARIOS.map((s) => ({ id: s.id, label: s.title }));
  const annotationOptions: SegmentOption<string>[] = [
    { id: 'on', label: 'Annotations affichées' },
    { id: 'off', label: 'Masquées' },
  ];
  const scenNext = () => setScenReplay((s) => stepReplay(s, 1));
  const scenPrev = () => setScenReplay((s) => stepReplay(s, -1));
  const scenAll = () => setScenReplay((s) => revealAll(s));
  const scenReset = () => setScenReplay((s) => resetReplay(s));

  useEffect(() => {
    analytics.track('lab_started', { scenario: 'trace_support' });
    analytics.track('lab_started', { scenario: 'volume_replay' });
  }, []);

  const markReplayDone = (next: ReturnType<typeof initReplay>) => {
    if (replayAtEnd(next) && !replayDone) {
      setReplayDone(true);
      analytics.track('lab_completed', { scenario: 'volume_replay', success: true });
    }
  };
  const replayNext = () => setReplay((s) => { const n = stepReplay(s, 1); markReplayDone(n); return n; });
  const replayPrev = () => setReplay((s) => stepReplay(s, -1));
  const replayAll = () => setReplay((s) => { const n = revealAll(s); markReplayDone(n); return n; });
  const replayReset = () => setReplay((s) => resetReplay(s));

  const close = revealed && userPrice != null && isLevelClose(userPrice, target, scale.range);

  const pick = (price: number) => {
    setUserPrice(price);
    setRevealed(false);
  };
  const nudge = (dir: -1 | 1) => {
    setRevealed(false);
    setUserPrice((p) => {
      const base = p ?? (scale.min + scale.max) / 2;
      return Math.max(scale.min, Math.min(scale.max, base + dir * step));
    });
  };
  const validate = () => {
    if (userPrice == null) return;
    setRevealed(true);
    analytics.track('lab_completed', { scenario: 'trace_support', success: isLevelClose(userPrice, target, scale.range) });
  };
  const reset = () => {
    setUserPrice(null);
    setRevealed(false);
  };

  return (
    <Screen>
      <Text variant="h1">Laboratoire</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Manipule un vrai graphique. Ici, tout est un scénario pédagogique — aucun conseil,
        aucun signal.
      </Text>

      <Card elevated>
        <View style={styles.chartHead}>
          <Text variant="title">Lis un graphique, étape par étape</Text>
          <Chip iconName="chart" label="scénario" color={theme.colors.technical} />
        </View>
        <SegmentedControl
          options={scenarioOptions}
          value={scenarioId}
          onChange={(id) => {
            setScenarioId(id);
            const next = chartScenarioById(id) ?? CHART_SCENARIOS[0];
            const nextCandles = datasetByKey(next.datasetKey);
            setScenReplay(initReplay(nextCandles.length, Math.min(6, nextCandles.length)));
            analytics.track('lab_started', { scenario: `read:${id}` });
          }}
          accessibilityLabel="Choisir un scénario de lecture"
        />
        <Text variant="body" color={theme.colors.textSecondary}>
          {scenario.question}
        </Text>

        <View style={styles.chart}>
          <MarketReplayChart candles={scenarioCandles} visibleCount={scenReplay.visible} width={300} height={170} />
        </View>

        <View style={styles.controls}>
          <Button label="⏮ Début" variant="secondary" fullWidth={false} disabled={replayAtStart(scenReplay)} onPress={scenReset} accessibilityHint="Première bougie" />
          <Button label="◀ Préc." variant="secondary" fullWidth={false} disabled={replayAtStart(scenReplay)} onPress={scenPrev} accessibilityHint="Bougie précédente" />
          <Button label="Suiv. ▶" variant="secondary" fullWidth={false} disabled={replayAtEnd(scenReplay)} onPress={scenNext} accessibilityHint="Bougie suivante" />
        </View>
        {!replayAtEnd(scenReplay) ? (
          <Button label="Tout révéler ⏭" variant="secondary" onPress={scenAll} accessibilityHint="Révéler toute la séquence" />
        ) : null}

        <View style={styles.annotationToggle}>
          <SegmentedControl
            options={annotationOptions}
            value={showAnnotations ? 'on' : 'off'}
            onChange={(v) => setShowAnnotations(v === 'on')}
            accessibilityLabel="Afficher ou masquer les annotations"
          />
        </View>

        {showAnnotations ? (
          <View style={styles.annotations}>
            {scenario.annotations.map((a) => (
              <View key={a.label} style={styles.annotationRow}>
                <TrademyIcon name="target" size={14} color={theme.colors.technical} />
                <View style={styles.flex1}>
                  <Text variant="label" color={theme.colors.technical}>
                    {a.label}
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {a.detail}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text variant="caption" color={theme.colors.textMuted}>
            Annotations masquées — lis le graphique par toi-même, puis réaffiche-les pour comparer.
          </Text>
        )}

        <View style={styles.debate}>
          <CharacterScene character="toto" state="explain" size={56} speech={scenario.toto} />
          <CharacterScene character="bobo" state="false-signal" size={56} reversed speech={scenario.bobo} />
        </View>
        <Text variant="caption" color={theme.colors.textMuted}>
          Scénario éducatif sur données déterministes — jamais un signal en temps réel.
        </Text>
      </Card>

      <Card elevated>
        <View style={styles.chartHead}>
          <Text variant="title">Scénario : trace le support</Text>
          <Chip label="niveau" color={theme.colors.technical} />
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          Le support est le plancher où les acheteurs reviennent. Touche le graphique (ou
          les flèches) pour poser ta ligne à ce niveau, puis valide.
        </Text>

        <View style={styles.chart}>
          <InteractiveChart
            candles={candles}
            width={300}
            height={170}
            userPrice={userPrice}
            targetPrice={revealed ? target : null}
            disabled={revealed}
            onPickPrice={pick}
          />
        </View>

        <View style={styles.legendRow}>
          {userPrice != null ? <Chip label={`Ton niveau : ${userPrice.toFixed(0)}`} color={theme.colors.technical} /> : null}
          {revealed ? <Chip label={`Support réel : ${target.toFixed(0)}`} color={theme.colors.bullish} /> : null}
        </View>

        <View style={styles.controls}>
          <Button label="↑ Monter" variant="secondary" fullWidth={false} disabled={revealed} onPress={() => nudge(1)} accessibilityHint="Monter le niveau" />
          <Button label="↓ Descendre" variant="secondary" fullWidth={false} disabled={revealed} onPress={() => nudge(-1)} accessibilityHint="Descendre le niveau" />
        </View>

        {!revealed ? (
          <Button
            label="Valider mon tracé"
            disabled={userPrice == null}
            disabledReason={userPrice == null ? 'Place d’abord ta ligne sur le graphique.' : undefined}
            onPress={validate}
          />
        ) : (
          <Button label="Réessayer" variant="secondary" onPress={reset} />
        )}

        {revealed ? (
          <CharacterScene
            character={close ? 'toto' : 'bobo'}
            state={close ? 'celebrate-small' : 'encourage'}
            size={60}
            speech={
              close
                ? 'Bien vu — ta ligne colle au plancher, là où la demande revient.'
                : 'Regarde le point le plus bas : le support se pose sur ce plancher, pas au milieu.'
            }
          />
        ) : null}
      </Card>

      <Card>
        <Text variant="label" color={theme.colors.technical}>
          🔎 À retenir
        </Text>
        <Text variant="body" style={styles.rule}>
          • Un support est une zone plancher, repérée par les creux les plus bas.
        </Text>
        <Text variant="body" style={styles.rule}>
          • C’est un repère, pas une garantie : un support finit parfois par céder.
        </Text>
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
        <CharacterScene character="toto" state="explain" size={60} speech="Un support tient tant que les acheteurs défendent le plancher." />
        <CharacterScene character="bobo" state="false-signal" size={60} reversed speech="Mais s’il casse nettement, le plancher devient un plafond." />
      </View>

      <Card elevated>
        <View style={styles.chartHead}>
          <Text variant="title">Observe la participation (replay)</Text>
          <Chip label="volume" color={theme.colors.technical} />
        </View>
        <Text variant="body" color={theme.colors.textSecondary}>
          Déroule la séquence bougie par bougie. Le panneau du bas montre le volume — la
          participation qui accompagne (ou non) le mouvement.
        </Text>

        <View style={styles.chart}>
          <MarketReplayChart candles={replayCandles} visibleCount={replay.visible} width={300} height={170} />
        </View>

        <View style={styles.legendRow}>
          <Chip label={`Bougie ${replay.visible} / ${replay.total}`} color={theme.colors.technical} />
          {replayAtEnd(replay) ? <Chip label="Séquence complète" color={theme.colors.bullish} /> : null}
        </View>

        <View style={styles.controls}>
          <Button label="⏮ Début" variant="secondary" fullWidth={false} disabled={replayAtStart(replay)} onPress={replayReset} accessibilityHint="Revenir à la première bougie" />
          <Button label="◀ Préc." variant="secondary" fullWidth={false} disabled={replayAtStart(replay)} onPress={replayPrev} accessibilityHint="Bougie précédente" />
          <Button label="Suiv. ▶" variant="secondary" fullWidth={false} disabled={replayAtEnd(replay)} onPress={replayNext} accessibilityHint="Bougie suivante" />
        </View>
        {!replayAtEnd(replay) ? (
          <Button label="Tout révéler ⏭" onPress={replayAll} accessibilityHint="Révéler toute la séquence" />
        ) : (
          <CharacterScene
            character="toto"
            state="explain"
            size={60}
            speech="Regarde où le volume gonfle : une poussée soutenue par la participation est plus crédible qu’un mouvement sans volume."
          />
        )}
      </Card>

      <Text variant="h2">Labs d’indicateurs</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Choisis un indicateur, ajuste son paramètre, et observe sa lecture se recomposer.
      </Text>
      <Card>
        <SegmentedControl
          options={labOptions}
          value={labId}
          onChange={(id) => {
            setLabId(id);
            const l = indicatorLabById(id);
            if (l) setLabParam(l.defaultValue);
            analytics.track('lab_started', { scenario: `indicator:${id}` });
          }}
          accessibilityLabel="Choisir un indicateur"
        />
        <View style={styles.paramRow}>
          <Text variant="label" color={theme.colors.textMuted}>
            {lab.paramLabel}
          </Text>
          <SegmentedControl
            options={paramOptions}
            value={String(labParam)}
            onChange={(v) => setLabParam(Number(v))}
            accessibilityLabel={`${lab.paramLabel} de ${lab.title}`}
          />
        </View>
        <IndicatorPanel
          candles={labCandles}
          config={labConfig}
          accessibilityLabel={`${lab.title} — ${lab.paramLabel} ${lab.formatValue(labParam)}. Ajuste le paramètre pour comparer.`}
        />
        <CharacterScene character="bobo" state="false-signal" size={56} reversed speech={lab.falseSignal} />
      </Card>

      <Text variant="h2">Visuels V5 (aperçu)</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Des schémas originaux, générés en code et accessibles. Ouvre une fiche pour voir le visuel en contexte.
      </Text>
      <VisualCard spec={ANATOMY_SPEC} title="Anatomie d’une bougie" />
      <Button
        label="Bibliothèque visuelle — toutes les figures"
        onPress={() => router.push('/bibliotheque-visuelle')}
        accessibilityHint="Ouvrir la galerie de toutes les figures illustrées"
      />
      <Card>
        <Text variant="title">Fiches visuelles</Text>
        <View style={styles.conceptList}>
          {V5_CONCEPTS.map((c) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityHint={`Ouvrir la fiche ${c.title}`}
              onPress={() => router.push(`/concept/${c.slug}`)}
              style={styles.conceptRow}
            >
              <Text variant="body" style={styles.flex1}>
                {c.title}
              </Text>
              <Text variant="body" color={theme.colors.technical}>
                ›
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Button
        label="Voir la leçon — Le double creux"
        variant="secondary"
        onPress={() => router.push('/lesson/lesson.double-bottom')}
        accessibilityHint="Ouvrir la leçon associée"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chart: { alignItems: 'center', marginVertical: theme.spacing.md },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  controls: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  rule: { marginTop: theme.spacing.xs },
  invalidCard: { borderColor: theme.colors.bearish },
  debate: { gap: theme.spacing.md },
  conceptList: { gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  conceptRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, minHeight: 40 },
  paramRow: { gap: theme.spacing.xs, marginVertical: theme.spacing.sm },
  annotationToggle: { marginTop: theme.spacing.sm },
  annotations: { gap: theme.spacing.sm, marginVertical: theme.spacing.sm },
  annotationRow: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-start' },
  flex1: { flex: 1 },
});
