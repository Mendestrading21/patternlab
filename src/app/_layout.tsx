import '../global.css';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/lib/errors';
import { useIsOnline } from '@/lib/useIsOnline';
import { ProgressProvider } from '@/data';
import { OfflineBanner, theme } from '@/design-system';

/** Bandeau hors-ligne global, sous la barre d'état. Ne prend de place que hors ligne. */
function OfflineGate() {
  const online = useIsOnline();
  if (online) return null;
  return (
    <SafeAreaView edges={['top']} style={styles.offlineSafe}>
      <OfflineBanner visible />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ProgressProvider>
            <StatusBar style="light" />
            <View style={styles.flex}>
              <OfflineGate />
              <View style={styles.flex}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                    animation: 'fade',
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="lesson/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="session/[skillId]" options={{ presentation: 'card' }} />
                </Stack>
              </View>
            </View>
          </ProgressProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  offlineSafe: { backgroundColor: theme.colors.surfaceInteractive },
});
