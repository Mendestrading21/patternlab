/**
 * @jest-environment node
 *
 * Test d'intégration LÉGER de NAVIGATION (Option A) : monte l'ÉCRAN DE MONDE de production
 * (`app/monde/[id].tsx`) dans le `ProgressProvider` réel et vérifie qu'ouvrir une unité émet
 * réellement la route `/session/<compétence>`. On ne reconstruit AUCUN routeur ; expo-router est
 * seulement mocké au niveau infrastructure (le vrai routeur natif ne tourne pas sous jest).
 *
 * Portée : les DESTINATIONS (monde → unité → session) sont vérifiées ici par émission de route ;
 * la session VERTICALE réelle est couverte par `session.integration.test.tsx` ; le gating des mondes
 * et prérequis par `pilotJourney.test.ts`. La traversée complète accueil → monde via le vrai routeur
 * expo-router reste un contrôle manuel (limite assumée).
 */
/* eslint-disable @typescript-eslint/no-require-imports, import/first -- fabriques jest.mock hissées
   au-dessus des imports et utilisant require() (contrainte du moteur de mocks jest). */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { create, act, type ReactTestInstance, type ReactTestRenderer } from 'react-test-renderer';
import { createElement } from 'react';

jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: { View, Text, createAnimatedComponent: (c: unknown) => c },
    useSharedValue: (v: unknown) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withTiming: (v: unknown) => v,
    withSpring: (v: unknown) => v,
    withSequence: (...a: unknown[]) => a[a.length - 1],
    withRepeat: (v: unknown) => v,
    withDelay: (_d: unknown, v: unknown) => v,
    cancelAnimation: () => {},
    Easing: { linear: (x: number) => x, inOut: () => (x: number) => x, ease: (x: number) => x },
    interpolate: () => 0,
    runOnJS: (fn: unknown) => fn,
  };
});
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const strip = ({ children, style }: { children?: unknown; style?: unknown }) =>
    React.createElement(View, { style }, children);
  return {
    __esModule: true,
    SafeAreaProvider: ({ children }: { children?: unknown }) => children,
    SafeAreaView: strip,
    useSafeAreaInsets: () => insets,
    SafeAreaInsetsContext: React.createContext(insets),
    initialWindowMetrics: { insets, frame: { x: 0, y: 0, width: 390, height: 844 } },
  };
});
jest.mock('expo-image', () => ({ __esModule: true, Image: require('react-native').View }));
jest.mock('expo-router', () => {
  const state: { params: Record<string, unknown>; calls: unknown[][] } = { params: { id: 'world.foundations' }, calls: [] };
  return {
    __esModule: true,
    __state: state,
    useLocalSearchParams: () => state.params,
    useRouter: () => ({
      push: (...a: unknown[]) => state.calls.push(['push', ...a]),
      replace: (...a: unknown[]) => state.calls.push(['replace', ...a]),
      back: () => {},
      navigate: () => {},
    }),
    useFocusEffect: () => {},
    Link: ({ children }: { children?: unknown }) => children ?? null,
    Stack: { Screen: () => null },
  };
});

import WorldScreen from '@/app/monde/[id]';
import { ProgressProvider } from '@/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoRouter from 'expo-router';

const routerState = (ExpoRouter as unknown as { __state: { params: Record<string, unknown>; calls: unknown[][] } }).__state;

function pressables(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((n) => typeof n.props?.onPress === 'function', { deep: true });
}
async function flush(): Promise<void> {
  for (let i = 0; i < 8; i++) {
    await act(async () => {
      await Promise.resolve();
    });
  }
}

beforeEach(async () => {
  await AsyncStorage.clear();
  routerState.params = { id: 'world.foundations' };
  routerState.calls.length = 0;
});

describe('Navigation de production — monde → unité → session (route émise)', () => {
  it('ouvrir une unité débloquée du monde pilote émet la route /session/<compétence>', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = create(createElement(ProgressProvider, null, createElement(WorldScreen)));
    });
    await flush();
    const root = renderer.root;

    // Le nœud d'unité débloqué porte l'indice « Ouvrir cette étape » (les verrouillés sont désactivés).
    const openNode = pressables(root).find((n) => String(n.props.accessibilityHint ?? '') === 'Ouvrir cette étape');
    expect(openNode).toBeDefined();
    act(() => (openNode!.props.onPress as () => void)());

    // L'écran de production a réellement émis une route vers une session de compétence.
    const pushed = routerState.calls.filter((c) => c[0] === 'push').map((c) => String(c[1]));
    expect(pushed.some((r) => r.startsWith('/session/skill.'))).toBe(true);
    await act(async () => renderer.unmount());
  });
});
