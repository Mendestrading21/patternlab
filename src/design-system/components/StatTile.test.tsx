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
});

describe('ProgressWidget — widget de progression premium (LOT 4)', () => {
  it('rend le titre et le pourcentage, avec un résumé accessible', () => {
    const r = render(createElement(ProgressWidget, { title: 'Monde 1', value: 0.6, caption: '3/5 étapes' }));
    const json = JSON.stringify(r.toJSON());
    expect(json).toContain('MONDE 1'); // titre en capitales
    expect(json).toContain('3/5 étapes');
    const labelled = r.root.findAll((n) => typeof n.props?.accessibilityLabel === 'string' && n.props.accessibilityLabel.includes('60 %'));
    expect(labelled.length).toBeGreaterThan(0);
    act(() => r.unmount());
  });

  it('tolère l’état vide (aucune stat, aucune valeur)', () => {
    const r = render(createElement(ProgressWidget, { title: 'Vide' }));
    expect(JSON.stringify(r.toJSON())).toContain('VIDE');
    act(() => r.unmount());
  });
});
