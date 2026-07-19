import { Pressable } from 'react-native';
import { theme } from '../theme';
import { hitSlopFor } from '../a11y';
import { Text } from './Text';

export type FavoriteButtonProps = {
  active: boolean;
  onToggle: () => void;
  /** Nom de l'élément, injecté dans le label d'accessibilité (« Ajouter … aux favoris »). */
  label: string;
  size?: 'md' | 'lg';
};

/**
 * Étoile favori ★/☆ accessible. Extrait le motif répété du glossaire (liste + fiches).
 * Couleur `reward` quand actif, `textMuted` sinon ; jamais porté par la seule couleur
 * (l'état est aussi dans `accessibilityState.selected` et le glyphe plein/vide).
 */
export function FavoriteButton({ active, onToggle, label, size = 'md' }: FavoriteButtonProps) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={hitSlopFor(28)}
      accessibilityRole="button"
      accessibilityLabel={active ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`}
      accessibilityState={{ selected: active }}
    >
      <Text variant={size === 'lg' ? 'h1' : 'h2'} color={active ? theme.colors.reward : theme.colors.textMuted}>
        {active ? '★' : '☆'}
      </Text>
    </Pressable>
  );
}
