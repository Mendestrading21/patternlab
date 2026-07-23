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
import { motion } from '../design-system/tokens';
import type { CharacterId, CharacterState } from './types';

export type CharacterAnimationControllerProps = {
  character: CharacterId;
  state?: CharacterState;
  size?: number;
};

/**
 * Point d'intégration unique pour l'animation des personnages (avatars vectoriels Toto/Bobo).
 *
 * Applique des micro-animations Reanimated pilotées par le registre d'états (source unique) :
 * pop bref au changement d'état (dosé par l'intensité, durée = token motion), et flottement
 * doux UNIQUEMENT au repos. Aucune boucle décorative hors idle. L'API {character, state, size}
 * est inchangée : tous les écrans en héritent.
 *
 * Respecte toujours « réduire les animations » : rendu statique (aucun mouvement) si activé,
 * avec le même libellé accessible.
 */
export function CharacterAnimationController({
  character,
  state = 'idle',
  size = 96,
}: CharacterAnimationControllerProps) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Intensité + libellé accessible pilotés par le registre d'états (source unique).
  const spec = CHARACTER_STATES[state];
  const intensity = spec?.intensity ?? 'subtle';
  const accessibleText = spec?.accessibleText ?? '';

  useEffect(() => {
    if (reduced) {
      cancelAnimation(scale);
      cancelAnimation(translateY);
      scale.value = 1;
      translateY.value = 0;
      return;
    }
    // réaction ponctuelle au changement d'état, dosée par l'intensité ; pop bref (< 120 ms).
    const pop = intensity === 'lively' ? 1.14 : intensity === 'still' ? 1.0 : 1.06;
    scale.value = withSequence(withTiming(pop, { duration: motion.instant }), withSpring(1));
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
    // Alternative STATIQUE : même avatar, aucune animation, même information (libellé accessible).
    return (
      <View accessibilityRole="image" accessibilityLabel={accessibleText}>
        <MascotAvatar character={character} state={state} size={size} />
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle} accessibilityRole="image" accessibilityLabel={accessibleText}>
      <MascotAvatar character={character} state={state} size={size} />
    </Animated.View>
  );
}
