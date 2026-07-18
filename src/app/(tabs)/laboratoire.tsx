import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, theme } from '@/design-system';
import { CharacterScene } from '@/characters';
import {
  InteractiveChart,
  generateCandles,
  priceScale,
  supportLevel,
  isLevelClose,
} from '@/engines/pattern';
import { DEMO_PATTERN } from '@/data';
import { analytics } from '@/analytics';

export default function Laboratoire() {
  const router = useRouter();
  const candles = generateCandles(2024, 30);
  const scale = priceScale(candles, 170);
  const target = supportLevel(candles);
  const step = scale.range * 0.02;

  const [userPrice, setUserPrice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    analytics.track('lab_started', { scenario: 'trace_support' });
  }, []);

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
      <Text variant="h1">Laboratoire 🧪</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Manipule un vrai graphique. Ici, tout est un scénario pédagogique — aucun conseil,
        aucun signal.
      </Text>

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

      <Button
        label="Voir la leçon — Le double creux"
        variant="secondary"
        onPress={() => router.push('/lesson/lesson.double-bottom')}
        accessibilityHint="Ouvrir la leçon associée"
      />
      <Button
        label="Tracé de zones & replay"
        disabled
        disabledReason="Zone rectangulaire, volume et replay interactifs : prochaines itérations du laboratoire."
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
});
