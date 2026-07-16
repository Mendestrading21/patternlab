import { type ReactNode } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { theme } from '../theme';

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: readonly Edge[];
};

/** Conteneur d'écran : safe-area + fond sombre + scroll optionnel. */
export function Screen({ children, scroll = true, edges = ['top', 'bottom'] }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  flex: { flex: 1 },
});
