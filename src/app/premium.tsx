import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, Text, Card, Button, Chip, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import {
  useProgress,
  PRICING,
  PREMIUM_FEATURES,
  FREE_FEATURES,
  CURRENCY,
  planById,
  type PlanId,
} from '@/data';
import { useConnectivity } from '@/lib/connectivity';
import { analytics } from '@/analytics';

function priceLabel(price: number): string {
  return `${price.toFixed(2)} ${CURRENCY}`;
}

export default function Premium() {
  const router = useRouter();
  const { premium, activatePremium, deactivatePremium, restorePremium } = useProgress();
  const online = useConnectivity();
  const [selected, setSelected] = useState<PlanId>('founder');

  useEffect(() => {
    analytics.track('paywall_viewed');
  }, []);

  if (premium.active) {
    const plan = planById(premium.plan);
    return (
      <Screen>
        <Text variant="h1">PatternLab Premium ✨</Text>
        <MascotFigure name="celebrate" gesture="celebrate" height={140} decorative />
        <Card elevated>
          <Text variant="title" color={theme.colors.reward}>
            Tu es Premium 🎉
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Offre active : {plan?.label ?? 'Premium'}. Tout le contenu premium est débloqué.
          </Text>
          <Text variant="caption" color={theme.colors.textMuted}>
            Activation de démonstration — aucun achat réel n’a été effectué.
          </Text>
        </Card>

        <Card>
          <Text variant="title">Ce que tu as débloqué</Text>
          <View style={styles.features}>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f.id} style={styles.featureRow}>
                <Text variant="body">{f.icon}</Text>
                <Text variant="body" style={styles.flex1}>
                  {f.label}
                </Text>
                <Text variant="body" color={theme.colors.bullish}>
                  ✓
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Button
          label="Désactiver l’accès (démo)"
          variant="secondary"
          onPress={deactivatePremium}
          accessibilityHint="Revenir à la version gratuite (simulation)"
        />
        <Button label="Retour" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  const plan = planById(selected);

  return (
    <Screen>
      <Text variant="caption" color={theme.colors.reward}>
        PATTERNLAB PREMIUM ✨
      </Text>
      <Text variant="h1">Va plus loin, à ton rythme</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        Tu as commencé le parcours. Premium débloque tout le contenu pour progresser sans limite.
      </Text>

      <Card elevated>
        <Text variant="title">Avec Premium</Text>
        <View style={styles.features}>
          {PREMIUM_FEATURES.map((f) => (
            <View key={f.id} style={styles.featureRow}>
              <Text variant="body">{f.icon}</Text>
              <Text variant="body" style={styles.flex1}>
                {f.label}
              </Text>
              <Text variant="body" color={theme.colors.reward}>
                ★
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text variant="title">Gratuit, pour toujours</Text>
        <View style={styles.features}>
          {FREE_FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text variant="body" color={theme.colors.bullish}>
                ✓
              </Text>
              <Text variant="body" color={theme.colors.textSecondary} style={styles.flex1}>
                {f}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Text variant="h2">Choisis ta formule</Text>
      <View style={styles.plans}>
        {PRICING.map((p) => {
          const active = selected === p.id;
          return (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityHint={`Choisir l’offre ${p.label}`}
              onPress={() => setSelected(p.id)}
              style={[styles.plan, active && styles.planActive]}
            >
              <View style={styles.planHead}>
                <Text variant="title" style={styles.flex1}>
                  {p.label}
                </Text>
                {p.badge ? <Chip label={p.badge} color={theme.colors.reward} /> : null}
              </View>
              <Text variant="h2">
                {priceLabel(p.price)}{' '}
                <Text variant="caption" color={theme.colors.textMuted}>
                  {p.period}
                </Text>
              </Text>
              {p.tagline ? (
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {p.tagline}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Button
        label={`Activer — ${plan?.label} (démo)`}
        variant="reward"
        disabled={!online}
        disabledReason="Connexion requise pour finaliser un achat."
        onPress={() => activatePremium(selected)}
        accessibilityHint="Activer Premium en simulation ; aucun achat réel"
      />
      <Text variant="caption" color={theme.colors.textMuted} center>
        Simulation — aucun achat réel n’est effectué, aucune donnée de paiement n’est demandée.
        Les prix sont des hypothèses.
      </Text>

      <Button
        label="Restaurer un achat"
        variant="secondary"
        disabled={!online}
        disabledReason="Connexion requise pour restaurer un achat."
        onPress={restorePremium}
      />
      <Button label="Plus tard" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  features: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex1: { flex: 1 },
  plans: { gap: theme.spacing.md },
  plan: {
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
  },
  planActive: { borderColor: theme.colors.reward, backgroundColor: theme.colors.surfaceElevated },
  planHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
});
