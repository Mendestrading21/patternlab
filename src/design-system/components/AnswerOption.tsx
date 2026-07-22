import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';
import { TrademyIcon } from '../icons/TrademyIcon';

export type AnswerState = 'idle' | 'selected' | 'correct' | 'incorrect';

export type AnswerOptionProps = {
  label: string;
  onPress?: () => void;
  state?: AnswerState;
  disabled?: boolean;
  index?: number;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function AnswerOption({ label, onPress, state = 'idle', disabled, index }: AnswerOptionProps) {
  const border =
    state === 'correct'
      ? theme.colors.feedbackCorrect
      : state === 'incorrect'
        ? theme.colors.feedbackIncorrect
        : state === 'selected'
          ? theme.colors.primary
          : theme.colors.border;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: state === 'selected' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { borderColor: border },
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      {typeof index === 'number' ? (
        <View style={[styles.badge, { borderColor: border }]}>
          <Text variant="label" color={border}>
            {LETTERS[index] ?? '?'}
          </Text>
        </View>
      ) : null}
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
      {state === 'correct' ? <TrademyIcon name="check" size={20} color={theme.colors.feedbackCorrect} /> : null}
      {state === 'incorrect' ? <TrademyIcon name="close" size={20} color={theme.colors.feedbackIncorrect} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    backgroundColor: theme.colors.surface,
  },
  pressed: { opacity: 0.8 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
});
