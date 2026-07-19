import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { IMAGES, type ImageName } from './assets';
import { useReducedMotion } from './useReducedMotion';

export type MascotGesture = 'idle' | 'wave' | 'celebrate' | 'think' | 'bounce';

export type MascotFigureProps = {
  name: ImageName;
  height?: number;
  gesture?: MascotGesture;
  /** Ombre portée douce au sol (ancrage). */
  shadow?: boolean;
  accessibilityLabel?: string;
  /** Masque la figure aux lecteurs d'écran quand elle est purement décorative. */
  decorative?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Paramètres d'animation par geste : bob (amplitude px), dur (ms), tilt (deg), breath (respiration).
const GESTURES: Record<MascotGesture, { bob: number; dur: number; tilt: number; breath: boolean }> = {
  idle: { bob: 5, dur: 2000, tilt: 0, breath: true },
  wave: { bob: 4, dur: 1300, tilt: 5, breath: true },
  celebrate: { bob: 12, dur: 520, tilt: 6, breath: false },
  think: { bob: 3, dur: 2500, tilt: 3, breath: true },
  bounce: { bob: 9, dur: 700, tilt: 0, breath: false },
};

function labelFor(name: ImageName): string {
  if (name.startsWith('toto')) return 'Toto, le taureau vert';
  if (name.startsWith('bobo')) return "Bobo, l'ours rouge";
  return 'Toto et Bobo';
}

/**
 * Personnage détouré (fond transparent) posé sans cadre, animé « au max » :
 * apparition (fondu + zoom), puis geste en boucle (respiration, salut oscillant,
 * rebond de célébration…), avec une ombre au sol qui suit le mouvement.
 * Rendu statique si « réduire les animations ».
 */
export function MascotFigure({
  name,
  height = 200,
  gesture = 'idle',
  shadow = true,
  accessibilityLabel,
  decorative = false,
  style,
}: MascotFigureProps) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(reduced ? 1 : 0);
  const enter = useSharedValue(reduced ? 1 : 0.9);
  const bob = useSharedValue(0);
  const tilt = useSharedValue(0);
  const breath = useSharedValue(1);

  useEffect(() => {
    if (reduced) {
      opacity.value = 1;
      enter.value = 1;
      bob.value = 0;
      tilt.value = 0;
      breath.value = 1;
      return;
    }
    const cfg = GESTURES[gesture] ?? GESTURES.idle;
    opacity.value = withTiming(1, { duration: 400 });
    enter.value = withTiming(1, { duration: 400 });
    bob.value = withRepeat(
      withSequence(withTiming(-cfg.bob, { duration: cfg.dur }), withTiming(0, { duration: cfg.dur })),
      -1,
      true
    );
    if (cfg.tilt) {
      tilt.value = withRepeat(
        withSequence(
          withTiming(-cfg.tilt, { duration: cfg.dur * 0.9 }),
          withTiming(cfg.tilt, { duration: cfg.dur * 0.9 })
        ),
        -1,
        true
      );
    }
    if (cfg.breath) {
      breath.value = withRepeat(
        withSequence(withTiming(1.02, { duration: cfg.dur }), withTiming(1, { duration: cfg.dur })),
        -1,
        true
      );
    }
    return () => {
      cancelAnimation(bob);
      cancelAnimation(tilt);
      cancelAnimation(breath);
    };
  }, [reduced, gesture, opacity, enter, bob, tilt, breath]);

  const figureStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: bob.value },
      { rotateZ: `${tilt.value}deg` },
      { scale: enter.value * breath.value },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => {
    const lift = Math.abs(bob.value);
    return { opacity: 0.26 - lift * 0.012, transform: [{ scaleX: 1 - lift * 0.02 }] };
  });

  return (
    <View style={[styles.wrap, { height }, style]}>
      {shadow ? <Animated.View style={[styles.shadow, shadowStyle]} /> : null}
      <Animated.View
        {...(decorative
          ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const }
          : { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: accessibilityLabel ?? labelFor(name) })}
        style={[styles.figure, figureStyle]}
      >
        <Image source={IMAGES[name]} style={StyleSheet.absoluteFill} contentFit="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  figure: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  shadow: {
    position: 'absolute',
    bottom: 6,
    width: '42%',
    height: 14,
    borderRadius: 999,
    backgroundColor: '#000',
  },
});
