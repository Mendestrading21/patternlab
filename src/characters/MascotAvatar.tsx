import { View, StyleSheet } from 'react-native';
import { Toto, Bobo } from './vector';
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
 * Avatar vectoriel (SVG) — net à toute taille, jamais pixelisé, sans débordement.
 * L'expression est déduite de l'état via STATE_TO_EXPRESSION. Même API que
 * l'ancien avatar : remplacement direct dans CharacterAnimationController.
 */
export function MascotAvatar({ character, state = 'idle', size = 96 }: MascotAvatarProps) {
  const expr = STATE_TO_EXPRESSION[state];
  const Face = character === 'toto' ? Toto : Bobo;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={LABEL[character]}
      style={[styles.wrap, { width: size, height: size }]}
    >
      <Face size={size} expression={expr} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
