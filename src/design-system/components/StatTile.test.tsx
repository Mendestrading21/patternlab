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

  it('honore le dynamic type (police plafonnée) — sûr même à 200 % de texte', () => {
    const r = render(createElement(StatTile, { label: 'XP', value: '+42' }));
    const scaled = r.root.findAll((n) => typeof n.props?.maxFontSizeMultiplier === 'number');
    expect(scaled.length).toBeGreaterThan(0);
    expect(scaled.every((t) => t.props.maxFontSizeMultiplier <= 1.8)).toBe(true);
    act(() => r.unmount());
  });
});

describe('ProgressWidget — widget de progression premium (LOT 4)', () => {
  it('rend le titre (capitales) et la légende', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1', value: 0.6, caption: '3/5 étapes' }));
    const json = JSON.stringify(r.toJSON());
    expect(json).toContain('MONDE 1');
    expect(json).toContain('3/5 étapes');
    act(() => r.unmount());
  });

  it('LOT 4-A : le pourcentage est porté par la VALEUR de la barre, jamais dupliqué dans un libellé', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1', value: 0.6 }));
    // Le pourcentage vit uniquement dans accessibilityValue (annoncé une fois par le lecteur d'écran).
    const withValue = r.root.findAll((n) => n.props?.accessibilityValue?.now === 60);
    expect(withValue.length).toBeGreaterThan(0);
    // AUCUN libellé accessible ne répète « 60 % » (plus de triple annonce titre + barre + valeur).
    const withPct = r.root.findAll(
      (n) => typeof n.props?.accessibilityLabel === 'string' && n.props.accessibilityLabel.includes('60 %'),
    );
    expect(withPct.length).toBe(0);
    // Le libellé de la barre est le TITRE seul (pas le pourcentage).
    const bars = r.root.findAll((n) => n.props?.accessibilityRole === 'progressbar');
    expect(bars.every((b) => b.props.accessibilityLabel === 'Monde 1')).toBe(true);
    act(() => r.unmount());
  });

  it('état vide : affiche une explication utile, pas seulement un titre + signature', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1' }));
    expect(JSON.stringify(r.toJSON())).toContain('Aucune progression enregistrée');
    act(() => r.unmount());
  });
});
