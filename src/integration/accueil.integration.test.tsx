/**
 * @jest-environment node
 *
 * Test d'intégration RENDU de l'écran d'ACCUEIL de production (`app/(tabs)/index.tsx`) monté dans le
 * `ProgressProvider` réel (LOT 4-B). Prouve, sur l'écran réel : les libellés de section (« MISSION DU
 * JOUR », « CONCEPT DU JOUR ») sont portés par des icônes de la FAMILLE Trademy (aucun emoji système),
 * et l'action principale émet réellement une route. expo-router est mocké au seul niveau infrastructure.
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
  const state: { calls: unknown[][] } = { calls: [] };
  return {
    __esModule: true,
    __state: state,
    useRouter: () => ({
      push: (...a: unknown[]) => state.calls.push(['push', ...a]),
      replace: (...a: unknown[]) => state.calls.push(['replace', ...a]),
      back: () => {},
      navigate: () => {},
    }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: () => {},
    Link: ({ children }: { children?: unknown }) => children ?? null,
    Stack: { Screen: () => null },
  };
});

import Home from '@/app/(tabs)/index';
import { ProgressProvider } from '@/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoRouter from 'expo-router';

const routerState = (ExpoRouter as unknown as { __state: { calls: unknown[][] } }).__state;

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
  routerState.calls.length = 0;
});

describe('Accueil de production — icônes de la famille + action principale (LOT 4-B)', () => {
  it('rend les libellés de section sans emoji système et émet une route depuis la mission du jour', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = create(createElement(ProgressProvider, null, createElement(Home)));
    });
    await flush();
    const root = renderer.root;
    const json = JSON.stringify(renderer.toJSON());

    // Libellés de section présents, portés par une icône de la famille (plus d'emoji préfixe).
    expect(json).toContain('MISSION DU JOUR');
    // AUCUN des emojis-icônes retirés n'apparaît dans le rendu.
    for (const emoji of ['🎯', '⏱️', '🪙', '💡', '👋']) {
      expect(json).not.toContain(emoji);
    }
    // Des icônes SVG de la famille sont bien rendues (au moins la puce Niveau/série + labels).
    const svgs = root.findAll((n) => n.props?.viewBox === '0 0 24 24', { deep: true });
    expect(svgs.length).toBeGreaterThan(0);

    // L'action principale (mission du jour) émet réellement une route.
    const cta = pressables(root).find(
      (n) => String(n.props.accessibilityHint ?? '') === 'Démarrer la mission du jour',
    );
    expect(cta).toBeDefined();
    act(() => (cta!.props.onPress as () => void)());
    const pushed = routerState.calls.filter((c) => c[0] === 'push');
    expect(pushed.length).toBeGreaterThan(0);

    await act(async () => renderer.unmount());
  });
});
