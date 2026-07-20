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
import { MascotAvatar } from './MascotAvatar';
import { useReducedMotion } from './useReducedMotion';
import { CHARACTER_STATES } from './states';
import type { CharacterId, CharacterState } from './types';

export type CharacterAnimationControllerProps = {
  character: CharacterId;
  state?: CharacterState;
  size?: number;
};

/**
 * Point d'intégration unique pour l'animation des personnages.
 *
 * Rend l'avatar d'art officiel (<MascotAvatar/>, rendu 3D découpé) et applique des
 * micro-animations Reanimated (flottement au repos, pop au changement d'état). L'API
 * {character, state, size} est inchangée : tous les écrans en héritent automatiquement.
 * Une bascule future vers Lottie (ADR-005) se ferait ici sans toucher les écrans.
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

  // Intensité pilotée par le registre d'états (source unique).
  const intensity = CHARACTER_STATES[state]?.intensity ?? 'subtle';

  useEffect(() => {
    if (reduced) {
      cancelAnimation(scale);
      cancelAnimation(translateY);
      scale.value = 1;
      translateY.value = 0;
      return;
    }
    // réaction ponctuelle au changement d'état, dosée par l'intensité
    const pop = intensity === 'lively' ? 1.14 : intensity === 'still' ? 1.0 : 1.06;
    scale.value = withSequence(withTiming(pop, { duration: 140 }), withSpring(1));
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
  }, [state, reduced, intensity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (reduced) {
    return (
      <View accessibilityElementsHidden={false}>
        <MascotAvatar character={character} state={state} size={size} />
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <MascotAvatar character={character} state={state} size={size} />
    </Animated.View>
  );
}
