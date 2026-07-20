import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Card, Button, theme } from '@/design-system';
import { APP_INFO, PRIVACY_SUMMARY, LEGAL_LINES } from '@/lib/appInfo';

export default function APropos() {
  const router = useRouter();

  return (
    <Screen>
      <Text variant="h1">À propos</Text>
      <Text variant="body" color={theme.colors.textSecondary}>
        {APP_INFO.name} — version {APP_INFO.version}
      </Text>

      <Card elevated>
        <Text variant="body">{APP_INFO.tagline}</Text>
        <Text variant="caption" color={theme.colors.textMuted}>
          {APP_INFO.disclaimer}
        </Text>
      </Card>

      <Card>
        <Text variant="title">Confidentialité</Text>
        <View style={styles.list}>
          {PRIVACY_SUMMARY.map((line) => (
            <View key={line} style={styles.row}>
              <Text variant="body" color={theme.colors.bullish}>
                ✓
              </Text>
              <Text variant="body" color={theme.colors.textSecondary} style={styles.flex1}>
                {line}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text variant="title">Mentions légales</Text>
        <View style={styles.list}>
          {LEGAL_LINES.map((line) => (
            <Text key={line} variant="caption" color={theme.colors.textMuted}>
              • {line}
            </Text>
          ))}
        </View>
      </Card>

      <Button label="Retour" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  flex1: { flex: 1 },
});
