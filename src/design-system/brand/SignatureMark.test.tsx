import { describe, it, expect } from '@jest/globals';
import { create, act, type ReactTestRenderer } from 'react-test-renderer';
import { createElement } from 'react';
import { SignatureMark } from './SignatureMark';

function render(el: React.ReactElement): ReactTestRenderer {
  let r!: ReactTestRenderer;
  act(() => {
    r = create(el);
  });
  return r;
}

describe('SignatureMark — motif de marque (LOT 4)', () => {
  it('est décoratif par défaut (masqué aux lecteurs d’écran)', () => {
    const r = render(createElement(SignatureMark, {}));
    const hidden = r.root.findAll((n) => n.props?.accessibilityElementsHidden === true);
    expect(hidden.length).toBeGreaterThan(0);
    act(() => r.unmount());
  });

  it('devient une image nommée quand un titre est fourni', () => {
    const r = render(createElement(SignatureMark, { title: 'Signature Trademy' }));
    const labelled = r.root.findAll((n) => n.props?.accessibilityLabel === 'Signature Trademy');
    expect(labelled.length).toBeGreaterThan(0);
    act(() => r.unmount());
  });

  it('conserve le ratio 2:1 (hauteur = largeur / 2)', () => {
    const r = render(createElement(SignatureMark, { width: 48 }));
    const svg = r.root.findAll((n) => n.props?.width === 48 && n.props?.height === 24);
    expect(svg.length).toBeGreaterThan(0);
    act(() => r.unmount());
  });
});
