import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

export type EmptyStateProps = {
  icon?: string;
  title: string;
  message?: string;
};

export function EmptyState({ icon = '🧭', title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="display" center>
        {icon}
      </Text>
      <Text variant="h2" center>
        {title}
      </Text>
      {message ? (
        <Text variant="body" color={theme.colors.textSecondary} center>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xxxl,
  },
});
