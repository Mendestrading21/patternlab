import { useEffect } from 'react';
import { StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { FIGURES, type FigureName } from './assets';
import { useReducedMotion } from './useReducedMotion';

export type MascotFigureProps = {
  name: FigureName;
  height?: number;
  /** Flottement doux au repos (désactivé si réduction d'animation). */
  float?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_LABEL: Record<FigureName, string> = {
  welcome: 'Toto et Bobo te souhaitent la bienvenue',
  study: 'Toto et Bobo étudient les marchés',
  present: 'Toto présente un graphique à Bobo',
  analyze: 'Toto et Bobo analysent un graphique',
  celebrate: 'Toto et Bobo célèbrent ta réussite',
  'bobo-risk': 'Bobo surveille les risques',
  toto: 'Toto, le taureau vert',
  bobo: "Bobo, l'ours rouge",
};

/**
 * Personnage(s) **détouré(s)** (fond transparent) posé(s) directement sur l'écran —
 * pas de cadre ni de fond. Apparition (fondu + léger zoom) et flottement doux au repos.
 * Rendu statique si « réduire les animations ».
 */
export function MascotFigure({
  name,
  height = 200,
  float = true,
  accessibilityLabel,
  style,
}: MascotFigureProps) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(reduced ? 1 : 0);
  const scale = useSharedValue(reduced ? 1 : 0.94);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (reduced) {
      opacity.value = 1;
      scale.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = withTiming(1, { duration: 420 });
    scale.value = withTiming(1, { duration: 420 });
    if (float) {
      translateY.value = withRepeat(
        withSequence(withTiming(-7, { duration: 2000 }), withTiming(0, { duration: 2000 })),
        -1,
        true
      );
    }
    return () => {
      cancelAnimation(translateY);
    };
  }, [reduced, float, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? DEFAULT_LABEL[name]}
      style={[styles.wrap, { height }, animatedStyle, style]}
    >
      <Image source={FIGURES[name]} style={StyleSheet.absoluteFill} contentFit="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
});
