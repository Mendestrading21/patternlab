import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { CharacterAvatar } from './CharacterAvatar';
import { useReducedMotion } from './useReducedMotion';
import type { CharacterId, CharacterState } from './types';

export type CharacterAnimationControllerProps = {
  character: CharacterId;
  state?: CharacterState;
  size?: number;
};

/**
 * Point d'intégration unique pour l'animation des personnages.
 *
 * ADR-005 : la technologie d'animation retenue est **Lottie** (dépendance
 * `lottie-react-native` installée). Tant que l'art Lottie de Toto/Bobo n'est pas
 * produit, ce contrôleur rend l'avatar SVG et applique des micro-animations
 * Reanimated. Brancher Lottie = remplacer <CharacterAvatar/> par le lecteur Lottie
 * ici, sans changer l'API consommée par les écrans.
 *
 * Respecte toujours « réduire les animations » : rendu statique si activé.
 */
export function CharacterAnimationController({
  character,
  state = 'idle',
  size = 96,
}: CharacterAnimationControllerProps) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const celebrating = state === 'celebrate-small' || state === 'celebrate-big' || state === 'streak' || state === 'level-up';

  useEffect(() => {
    if (reduced) {
      cancelAnimation(scale);
      cancelAnimation(translateY);
      scale.value = 1;
      translateY.value = 0;
      return;
    }
    // petite réaction ponctuelle au changement d'état
    scale.value = withSequence(withTiming(celebrating ? 1.14 : 1.06, { duration: 140 }), withSpring(1));
    // flottement doux uniquement au repos
    if (state === 'idle') {
      translateY.value = withRepeat(withSequence(withTiming(-3, { duration: 1100 }), withTiming(0, { duration: 1100 })), -1, true);
    } else {
      cancelAnimation(translateY);
      translateY.value = withTiming(0, { duration: 200 });
    }
    return () => {
      cancelAnimation(translateY);
    };
  }, [state, reduced, celebrating, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (reduced) {
    return (
      <View accessibilityElementsHidden={false}>
        <CharacterAvatar character={character} state={state} size={size} />
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <CharacterAvatar character={character} state={state} size={size} />
    </Animated.View>
  );
}
