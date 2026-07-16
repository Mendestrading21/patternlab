import { View, type ViewProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

export type CardProps = ViewProps & {
  elevated?: boolean;
  padded?: boolean;
};

export function Card({ elevated, padded = true, style, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface },
        padded && styles.padded,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  padded: { padding: theme.spacing.lg },
});
