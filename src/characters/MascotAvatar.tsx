import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../design-system/theme';
import { headSource } from './assets';
import { STATE_TO_EXPRESSION, type CharacterId, type CharacterState } from './types';

export type MascotAvatarProps = {
  character: CharacterId;
  state?: CharacterState;
  size?: number;
};

const LABEL: Record<CharacterId, string> = {
  toto: 'Toto, le taureau vert',
  bobo: "Bobo, l'ours rouge",
};

/**
 * Avatar rond utilisant l'art officiel (rendu 3D). L'expression est déduite de
 * l'état via STATE_TO_EXPRESSION — même API que l'ancien avatar SVG, donc c'est
 * un remplacement direct dans CharacterAnimationController.
 */
export function MascotAvatar({ character, state = 'idle', size = 96 }: MascotAvatarProps) {
  const expr = STATE_TO_EXPRESSION[state];
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={LABEL[character]}
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image
        source={headSource(character, expr)}
        style={{ width: size, height: size }}
        contentFit="cover"
        transition={180}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
});
