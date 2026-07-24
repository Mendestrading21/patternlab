import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { TrademyIcon } from '../icons/TrademyIcon';
import { Text } from './Text';

export type FlashcardProps = { front: string; back: string };

/** Carte de révision : question au recto, réponse révélée au toucher (pas d'animation → reduced-motion safe). */
export function Flashcard({ front, back }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: revealed }}
      accessibilityHint={revealed ? 'Masquer la réponse' : 'Révéler la réponse'}
      onPress={() => setRevealed((r) => !r)}
      style={styles.card}
    >
      <View style={styles.labelRow}>
        <TrademyIcon name="review" size={16} color={theme.colors.technical} />
        <Text variant="label" color={theme.colors.technical}>
          FLASHCARD
        </Text>
      </View>
      <Text variant="title">{front}</Text>
      {revealed ? (
        <View style={styles.back}>
          <Text variant="body" color={theme.colors.textSecondary}>
            {back}
          </Text>
        </View>
      ) : (
        <Text variant="caption" color={theme.colors.textMuted}>
          Touche pour révéler la réponse
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  back: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
});
