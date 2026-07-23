import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { TrademyIcon } from '../icons/TrademyIcon';

/**
 * Barre d'XP (Trademy Learning Glass) : badge de niveau + progression vers le niveau suivant.
 * Points pédagogiques, jamais une devise réelle. Valeur bornée 0→1.
 */
export type XPBarProps = {
  level: number;
  xpInLevel: number;
  xpPerLevel?: number;
};

export function XPBar({ level, xpInLevel, xpPerLevel = 100 }: XPBarProps) {
  const clamped = Math.max(0, Math.min(xpPerLevel, Math.round(xpInLevel)));
  const value = xpPerLevel > 0 ? clamped / xpPerLevel : 0;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.badge}>
          <TrademyIcon name="star" size={13} color={theme.colors.onPrimary} />
          <Text variant="label" color={theme.colors.onPrimary}>
            Niveau {level}
          </Text>
        </View>
        <Text variant="caption" color={theme.colors.textMuted}>
          {clamped} / {xpPerLevel} XP
        </Text>
      </View>
      <ProgressBar value={value} accessibilityLabel={`${clamped} sur ${xpPerLevel} XP vers le niveau ${level + 1}`} />
      <Text variant="caption" color={theme.colors.textMuted}>
        Plus que {xpPerLevel - clamped} XP vers le niveau {level + 1}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
});
