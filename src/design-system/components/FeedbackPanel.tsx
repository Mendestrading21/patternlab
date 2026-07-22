import { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';
import { TrademyIcon } from '../icons/TrademyIcon';

export type FeedbackPanelProps = {
  correct: boolean;
  message: string;
  rule?: string;
  whenItFails?: string;
  /** Emplacement pour un visuel ou une intervention de mascotte (feedback illustré). */
  children?: ReactNode;
};

/**
 * Panneau de correction (canonique) : icône de statut + toujours expliquer pourquoi, la règle, et
 * quand elle échoue. L'erreur reste éducative (icône info, jamais punitive). Un visuel ou une
 * mascotte peut être passé en `children`.
 */
export function FeedbackPanel({ correct, message, rule, whenItFails, children }: FeedbackPanelProps) {
  const accent = correct ? theme.colors.feedbackCorrect : theme.colors.feedbackIncorrect;
  return (
    <View style={[styles.panel, { borderColor: accent, backgroundColor: theme.colors.surfaceElevated }]}>
      <View style={styles.titleRow}>
        <TrademyIcon name={correct ? 'check' : 'info'} size={20} color={accent} />
        <Text variant="title" color={accent}>
          {correct ? 'Correct !' : 'Pas tout à fait'}
        </Text>
      </View>
      <Text variant="body">{message}</Text>
      {rule ? (
        <Text variant="label" color={theme.colors.textSecondary}>
          À retenir : {rule}
        </Text>
      ) : null}
      {whenItFails ? (
        <Text variant="caption" color={theme.colors.textMuted}>
          Quand ça se complique : {whenItFails}
        </Text>
      ) : null}
      {children ? <View style={styles.slot}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  slot: { marginTop: theme.spacing.xs },
});
