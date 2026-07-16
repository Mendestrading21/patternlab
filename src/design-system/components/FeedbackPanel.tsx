import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

export type FeedbackPanelProps = {
  correct: boolean;
  message: string;
  rule?: string;
  whenItFails?: string;
};

/** Panneau de correction : toujours expliquer pourquoi, la règle, et quand elle échoue. */
export function FeedbackPanel({ correct, message, rule, whenItFails }: FeedbackPanelProps) {
  const accent = correct ? theme.colors.feedbackCorrect : theme.colors.feedbackIncorrect;
  return (
    <View style={[styles.panel, { borderColor: accent, backgroundColor: theme.colors.surfaceElevated }]}>
      <Text variant="title" color={accent}>
        {correct ? 'Correct !' : 'Pas tout à fait'}
      </Text>
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
});
