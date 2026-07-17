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
import { theme } from '../design-system/theme';
import { SCENES, type SceneMoment } from './assets';
import { useReducedMotion } from './useReducedMotion';

export type MascotSceneProps = {
  moment: SceneMoment;
  height?: number;
  rounded?: boolean;
  /** Flottement doux au repos (désactivé si réduction d'animation). */
  float?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_LABEL: Record<SceneMoment, string> = {
  welcome: 'Toto et Bobo te souhaitent la bienvenue',
  study: 'Toto et Bobo étudient les marchés',
  present: 'Toto présente un graphique',
  analyze: 'Toto et Bobo analysent un graphique',
  warning: 'Bobo met en garde sur les risques',
  celebrate: 'Toto et Bobo célèbrent ta réussite',
  'bobo-risk': 'Bobo surveille les risques',
};

/**
 * Grande illustration de scène (art officiel), avec apparition en fondu + zoom
 * et un flottement doux au repos. Rendu statique si « réduire les animations ».
 */
export function MascotScene({
  moment,
  height = 200,
  rounded = true,
  float = true,
  accessibilityLabel,
  style,
}: MascotSceneProps) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(reduced ? 1 : 0);
  const scale = useSharedValue(reduced ? 1 : 0.96);
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
        withSequence(withTiming(-6, { duration: 1900 }), withTiming(0, { duration: 1900 })),
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
      accessibilityLabel={accessibilityLabel ?? DEFAULT_LABEL[moment]}
      style={[
        styles.wrap,
        { height, borderRadius: rounded ? theme.radius.lg : 0 },
        animatedStyle,
        style,
      ]}
    >
      <Image source={SCENES[moment]} style={StyleSheet.absoluteFill} contentFit="cover" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
});
