import { type StyleProp, type TextStyle } from 'react-native';
import { Text, theme } from '@/design-system';
import { DISCLAIMER } from '@/lib/config';

/**
 * Rappel éducatif Trademy — composant unique (aucune recréation locale). Texte canonique
 * dérivé de `APP_INFO.disclaimer`. « Application éducative. Aucun conseil financier. »
 */
export type DisclaimerProps = {
  /** Centrer le texte (par défaut true). */
  center?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Disclaimer({ center = true, style }: DisclaimerProps) {
  return (
    <Text variant="caption" color={theme.colors.textMuted} center={center} style={style}>
      {DISCLAIMER}
    </Text>
  );
}
