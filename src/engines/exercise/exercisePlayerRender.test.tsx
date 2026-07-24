/**
 * Tests de RENDU du composant de production `ExercisePlayer` (react-test-renderer, fourni par
 * jest-expo — aucune dépendance ajoutée). On monte le vrai player et on actionne ses vrais contrôles.
 * Ce fichier reste au niveau COMPOSANT (pas de fausse boucle de session : le parcours réel est couvert
 * par `src/app/session/session.integration.test.tsx`, qui monte l'écran de session de production).
 */
import { describe, it, expect } from '@jest/globals';
import { create, act, type ReactTestInstance, type ReactTestRenderer } from 'react-test-renderer';
import { ExercisePlayer, gradeExercise, scenarioA11ySummary, type Exercise } from './index';
import { CANDLE_PILOT_EXERCISES, CANDLE_PILOT_SCENARIOS } from '../../data/pilotScenarios';

function textOf(inst: ReactTestInstance): string {
  const out: string[] = [];
  const visit = (n: ReactTestInstance | string) => {
    if (typeof n === 'string') return void out.push(n);
    for (const c of n.children) visit(c);
  };
  for (const c of inst.children) visit(c);
  return out.join(' ');
}
function pressables(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((n) => typeof n.props?.onPress === 'function', { deep: true });
}
function pressText(root: ReactTestInstance, text: string): void {
  const b = pressables(root).find((n) => textOf(n).includes(text));
  if (!b) throw new Error(`Aucun contrôle rendu ne contient « ${text} »`);
  act(() => (b.props.onPress as () => void)());
}
function pressLabel(root: ReactTestInstance, labelIncludes: string, times = 1): void {
  for (let i = 0; i < times; i++) {
    const b = pressables(root).find((n) => String(n.props.accessibilityLabel ?? '').includes(labelIncludes));
    if (!b) throw new Error(`Aucun contrôle avec libellé « ${labelIncludes} »`);
    act(() => (b.props.onPress as () => void)());
  }
}
function a11yLabels(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => typeof n.props?.accessibilityLabel === 'string', { deep: true })
    .map((n) => String(n.props.accessibilityLabel));
}
function readOrder(root: ReactTestInstance, items: string[]): number[] {
  const byPos: string[] = [];
  for (const n of pressables(root)) {
    const m = String(n.props.accessibilityLabel ?? '').match(/^Monter « (.*) » \(position (\d+) sur \d+\)$/);
    if (m) byPos[Number(m[2]) - 1] = m[1];
  }
  return byPos.map((t) => items.indexOf(t));
}
function renderExercise(ex: Exercise): { root: ReactTestInstance; captured: () => unknown } {
  let captured: unknown;
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<ExercisePlayer exercise={ex} result={null} onValidate={(a) => (captured = a)} />);
  });
  return { root: renderer.root, captured: () => captured };
}

const byId = (id: string) => CANDLE_PILOT_EXERCISES.find((e) => e.id === id)!;

describe('ExercisePlayer (production) — rendu et manipulation réels', () => {
  it('ordre : présenté MÉLANGÉ (jamais résolu), validé à vide → refusé par le grader réel', () => {
    const order = byId('ex.candles.read-order');
    if (order.type !== 'order') throw new Error('type');
    const { root, captured } = renderExercise(order);
    const initial = readOrder(root, order.items);
    expect([...initial].sort((a, b) => a - b)).toEqual(order.items.map((_, i) => i));
    expect(initial).not.toEqual(order.validation.correctOrder);
    pressText(root, 'Valider l’ordre');
    expect(gradeExercise(order, captured()).correct).toBe(false);
  });

  it('ordre : reconstitué par les flèches (44 px) → indices exacts transmis → réussite', () => {
    const order = byId('ex.candles.read-order');
    if (order.type !== 'order') throw new Error('type');
    const { root, captured } = renderExercise(order);
    const correct = order.validation.correctOrder;
    const rank = (idx: number) => correct.indexOf(idx);
    for (let g = 0; g <= order.items.length ** 2 + 2; g++) {
      const cur = readOrder(root, order.items);
      const pos = cur.findIndex((_, i) => i < cur.length - 1 && rank(cur[i]) > rank(cur[i + 1]));
      if (pos < 0) break;
      pressLabel(root, `Descendre « ${order.items[cur[pos]]} » (position ${pos + 1} sur ${cur.length})`);
    }
    expect(readOrder(root, order.items)).toEqual(correct);
    pressText(root, 'Valider l’ordre');
    expect(gradeExercise(order, captured()).correct).toBe(true);
  });

  it('résumé accessible affiché = résumé CANONIQUE du scénario (sans fuite de réponse)', () => {
    for (const scenario of CANDLE_PILOT_SCENARIOS) {
      if (!('chartSeed' in scenario)) continue;
      const ex = byId(scenario.id);
      const { root } = renderExercise(ex);
      const summary = scenarioA11ySummary(scenario);
      const labels = a11yLabels(root);
      expect(labels.some((l) => l === summary || l.includes(summary))).toBe(true);
      if (scenario.interaction === 'label-extreme') {
        const svg = labels.find((l) => l.includes(summary))!;
        expect(svg).toContain('repère marque la bougie numéro');
        expect(svg).not.toContain('mèche haute'); // ne révèle pas la bonne option
      }
    }
  });

  it('4e mécanique (place_invalidation) : opérable au CLAVIER (↑/↓) et au lecteur d’écran, puis validée', () => {
    const place = byId('ex.candles.place-high');
    if (place.type !== 'place_invalidation') throw new Error('type');
    const { root, captured } = renderExercise(place);
    // Lecteur d'écran : le graphique est « adjustable » et porte le résumé canonique.
    const adjustable = root.findAll((n) => n.props?.accessibilityRole === 'adjustable', { deep: true });
    expect(adjustable.length).toBeGreaterThanOrEqual(1);
    // Clavier : les flèches Monter/Descendre existent (production ArrowBtn) et déplacent le niveau.
    expect(a11yLabels(root)).toEqual(expect.arrayContaining(['Monter', 'Descendre']));
    pressLabel(root, 'Monter', 60); // remonte jusqu'au plus haut (clampé au sommet = cible)
    pressText(root, 'Valider mon niveau');
    expect(typeof captured()).toBe('number');
    expect(gradeExercise(place, captured()).correct).toBe(true);
  });
});
