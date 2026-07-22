import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Screen, Text, Button, theme } from '@/design-system';
import { MascotFigure } from '@/characters';
import { useProgress } from '@/data';
import { APP, DISCLAIMER } from '@/lib/config';

export default function Landing() {
  const router = useRouter();
  const { state } = useProgress();
  const onboarded = state?.onboarded ?? false;

  return (
    <Screen scroll={false}>
      <View style={styles.top}>
        <Text variant="caption" color={theme.colors.primary} center>
          {APP.name.toUpperCase()}
        </Text>
        <Text variant="display" center>
          Apprends à lire{'\n'}les marchés
        </Text>
        <Text variant="body" color={theme.colors.textSecondary} center>
          {APP.tagline}
        </Text>
      </View>

      <View style={styles.duo}>
        <View style={styles.flex1}>
          <MascotFigure name="toto-wave" gesture="wave" height={230} />
        </View>
        <View style={styles.flex1}>
          <MascotFigure name="bobo-wave" gesture="idle" height={230} />
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={onboarded ? 'Reprendre' : 'Commencer'}
          onPress={() => router.push(onboarded ? '/(tabs)' : '/onboarding')}
        />
        <Button
          label="J’ai déjà un compte"
          variant="ghost"
          disabled
          disabledReason="Comptes & connexion : prévus en P2."
        />
        <Text variant="caption" color={theme.colors.textMuted} center>
          {DISCLAIMER}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { gap: theme.spacing.sm, marginTop: theme.spacing.xxl },
  duo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  actions: { gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  flex1: { flex: 1 },
});
