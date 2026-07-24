import { describe, it, expect } from '@jest/globals';
import { create, act, type ReactTestRenderer } from 'react-test-renderer';
import { createElement } from 'react';
import { StatTile } from './StatTile';
import { ProgressWidget } from './ProgressWidget';

function render(el: React.ReactElement): ReactTestRenderer {
  let r!: ReactTestRenderer;
  act(() => {
    r = create(el);
  });
  return r;
}

describe('StatTile — tuile de statistique partagée (LOT 4)', () => {
  it('annonce « label : value » d’un bloc et affiche la valeur', () => {
    const r = render(createElement(StatTile, { label: 'XP', value: '+42' }));
    const labelled = r.root.findAll((n) => n.props?.accessibilityLabel === 'XP : +42');
    expect(labelled.length).toBeGreaterThan(0);
    expect(JSON.stringify(r.toJSON())).toContain('+42');
    act(() => r.unmount());
  });

  it('accepte une étiquette accessible surchargée', () => {
    const r = render(
      createElement(StatTile, { label: 'Précision', value: '80%', accessibilityLabel: 'Précision : 80 pour cent' }),
    );
    const labelled = r.root.findAll((n) => n.props?.accessibilityLabel === 'Précision : 80 pour cent');
    expect(labelled.length).toBeGreaterThan(0);
    act(() => r.unmount());
  });

  it('honore le PLAFOND de dynamic type (cap ≤ 1,8 via le Text partagé)', () => {
    // NB : ce test vérifie que le plafond natif est appliqué, PAS que la mise en page tient à 200 %.
    // Une vraie preuve de reflow à 200 % exige un appareil/simulateur (voir limite documentée au README).
    const r = render(createElement(StatTile, { label: 'XP', value: '+42' }));
    const scaled = r.root.findAll((n) => typeof n.props?.maxFontSizeMultiplier === 'number');
    expect(scaled.length).toBeGreaterThan(0);
    expect(scaled.every((t) => t.props.maxFontSizeMultiplier <= 1.8)).toBe(true);
    act(() => r.unmount());
  });
});

/** Parcourt l'arbre HÔTE (toJSON) — sans duplication composite/hôte de react-test-renderer. */
function walkJson(node: unknown, pred: (n: Record<string, unknown>) => boolean, acc: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (!node) return acc;
  if (Array.isArray(node)) {
    for (const n of node) walkJson(n, pred, acc);
    return acc;
  }
  if (typeof node === 'object') {
    const n = node as Record<string, unknown>;
    if (pred(n)) acc.push(n);
    walkJson((n as { children?: unknown }).children, pred, acc);
  }
  return acc;
}

describe('ProgressWidget — widget de progression premium (LOT 4)', () => {
  it('rend le titre (capitales) et la légende', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1', value: 0.6, caption: '3/5 étapes' }));
    const json = JSON.stringify(r.toJSON());
    expect(json).toContain('MONDE 1');
    expect(json).toContain('3/5 étapes');
    act(() => r.unmount());
  });

  it('LOT 4-A : EXACTEMENT une barre, un pourcentage (valeur), aucun libellé qui le duplique', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1', value: 0.6 }));
    const tree = r.toJSON();
    // Sur l'arbre HÔTE réel (rendu) : exactement UNE barre de progression.
    const bars = walkJson(tree, (n) => (n.props as Record<string, unknown> | undefined)?.accessibilityRole === 'progressbar');
    expect(bars.length).toBe(1);
    // Le pourcentage n'est porté qu'à UN seul endroit : accessibilityValue.now.
    const withValue = walkJson(tree, (n) => ((n.props as { accessibilityValue?: { now?: number } } | undefined)?.accessibilityValue?.now) === 60);
    expect(withValue.length).toBe(1);
    // AUCUN accessibilityLabel ne répète la valeur (« 60% », « 60 % » ou « 60 pour cent »).
    const dupPct = /60\s*%|60\s*pour\s*cent/i;
    const withPct = walkJson(tree, (n) => {
      const l = (n.props as { accessibilityLabel?: unknown } | undefined)?.accessibilityLabel;
      return typeof l === 'string' && dupPct.test(l);
    });
    expect(withPct.length).toBe(0);
    // Le libellé de la barre est le TITRE seul.
    expect((bars[0].props as { accessibilityLabel?: string }).accessibilityLabel).toBe('Monde 1');
    act(() => r.unmount());
  });

  it('état vide : affiche une explication utile, pas seulement un titre + signature', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1' }));
    expect(JSON.stringify(r.toJSON())).toContain('Aucune progression enregistrée');
    act(() => r.unmount());
  });
});
