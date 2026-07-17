import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

export type OfflineBannerProps = { visible: boolean };

/** Bandeau discret indiquant l'état hors ligne. Rôle « alert » pour les lecteurs d'écran. */
export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;
  return (
    <View accessibilityRole="alert" style={styles.bar}>
      <Text variant="label" color={theme.colors.textPrimary} center>
        📡 Hors ligne — ta progression reste enregistrée sur cet appareil.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.surfaceInteractive,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderStrong,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
});
