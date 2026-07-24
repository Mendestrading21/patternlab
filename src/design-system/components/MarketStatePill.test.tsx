import { describe, it, expect } from '@jest/globals';
import { create, act, type ReactTestRenderer } from 'react-test-renderer';
import { createElement } from 'react';
import {
  MarketStatePill,
  MARKET_STATES,
  MARKET_STATE_ORDER,
  type MarketState,
} from './MarketStatePill';

function render(el: React.ReactElement): ReactTestRenderer {
  let r!: ReactTestRenderer;
  act(() => {
    r = create(el);
  });
  return r;
}

describe('MarketStatePill — sémantique d’état de marché (LOT 4)', () => {
  it('couvre exactement les 5 états pédagogiques autorisés', () => {
    expect(MARKET_STATE_ORDER).toHaveLength(5);
    expect(new Set(MARKET_STATE_ORDER).size).toBe(5);
    expect(MARKET_STATE_ORDER).toEqual([
      'bullish-setup',
      'bearish-setup',
      'confirmation',
      'invalidation',
      'false-signal',
    ]);
  });

  it('chaque état porte une icône, une couleur ET un libellé distincts (couleur jamais seule)', () => {
    const icons = MARKET_STATE_ORDER.map((s) => MARKET_STATES[s].icon);
    const labels = MARKET_STATE_ORDER.map((s) => MARKET_STATES[s].label);
    const colors = MARKET_STATE_ORDER.map((s) => MARKET_STATES[s].color);
    expect(new Set(icons).size).toBe(5); // formes distinctes
    expect(new Set(labels).size).toBe(5); // textes distincts
    expect(new Set(colors).size).toBe(5); // teintes distinctes
  });

  it('les directions de marché utilisent des flèches NEUTRES, jamais l’icône de progression', () => {
    // Séparation marché ↔ progression pédagogique (LOT 4-A) : pas de morale hausse=réussite.
    expect(MARKET_STATES['bullish-setup'].icon).toBe('market-up');
    expect(MARKET_STATES['bearish-setup'].icon).toBe('market-down');
    for (const s of MARKET_STATE_ORDER) {
      expect(MARKET_STATES[s].icon).not.toBe('progression');
      expect(MARKET_STATES[s].icon).not.toBe('decline');
    }
  });

  it('n’utilise aucun vocabulaire interdit (jamais BUY/SELL/ordre)', () => {
    const forbidden = /\b(buy|sell|achet|vend|ordre|profit garanti|gain garanti)\b/i;
    for (const s of MARKET_STATE_ORDER) {
      expect(MARKET_STATES[s].label).not.toMatch(forbidden);
      expect(MARKET_STATES[s].a11y).not.toMatch(forbidden);
    }
  });

  it('emploie le vocabulaire autorisé (setup, confirmation, invalidation, faux signal)', () => {
    expect(MARKET_STATES['bullish-setup'].label).toMatch(/setup haussier/i);
    expect(MARKET_STATES['bearish-setup'].label).toMatch(/setup baissier/i);
    expect(MARKET_STATES.confirmation.label).toMatch(/confirmation/i);
    expect(MARKET_STATES.invalidation.label).toMatch(/invalidation/i);
    expect(MARKET_STATES['false-signal'].label).toMatch(/faux signal/i);
  });

  it('rend l’état avec un résumé accessible et le libellé visible (double signal)', () => {
    for (const s of MARKET_STATE_ORDER as MarketState[]) {
      const r = render(createElement(MarketStatePill, { state: s }));
      const json = JSON.stringify(r.toJSON());
      // Le libellé texte est présent (le sens ne dépend pas de la seule couleur).
      expect(json).toContain(MARKET_STATES[s].label);
      // Un noeud porte le résumé accessible.
      const labelled = r.root.findAll((n) => n.props?.accessibilityLabel === MARKET_STATES[s].a11y);
      expect(labelled.length).toBeGreaterThan(0);
      act(() => r.unmount());
    }
  });
});
