import { describe, it, expect } from '@jest/globals';
import { V5_CONCEPTS } from './learningContent';

const FORBIDDEN = /\b(buy|sell|profit garanti|signal sûr|trade gagnant|liberté financière garantie)\b/i;
const FLAGSHIP = ['marche-et-prix', 'tendance-haussiere', 'cassure-retest', 'faux-breakout'];

// Batch 1 d'enrichissement éditorial (ADR-088) : le premier parcours du débutant est enrichi
// de bout en bout (mondes Fondations · Anatomie · Structure · Supports/Résistances · Faux signaux).
const BATCH_1 = [
  'dividende',
  'per',
  'anatomie-bougie',
  'echelle-des-prix',
  'unite-de-temps',
  'support-resistance',
  'retest-de-niveau',
  'polarite-flip',
  'range',
  'tendance-baissiere',
  'cassure-de-structure',
  'faux-signal',
];

// Batch 2 d'enrichissement éditorial (ADR-089) : le monde des chandeliers (world.candles) enrichi
// de bout en bout — 14 concepts, durée + dialogue Toto/Bobo.
const BATCH_2 = [
  'marteau',
  'doji',
  'etoile-filante',
  'avalement-haussier',
  'marubozu',
  'pendu',
  'marteau-inverse',
  'avalement-baissier',
  'harami',
  'etoile-du-matin',
  'etoile-du-soir',
  'trois-soldats',
  'trois-corbeaux',
  'pincettes',
];

// Batch 3 d'enrichissement éditorial (ADR-090) : le monde des figures chartistes (world.patterns)
// enrichi de bout en bout — 13 concepts, durée + dialogue Toto/Bobo.
const BATCH_3 = [
  'double-creux',
  'double-sommet',
  'triangle-ascendant',
  'triangle-descendant',
  'triangle-symetrique',
  'epaule-tete-epaule',
  'etei-inversee',
  'drapeau-haussier',
  'drapeau-baissier',
  'biseau-ascendant',
  'biseau-descendant',
  'tasse-anse',
  'triple-creux',
];

// Batch 4 d'enrichissement editorial (ADR-091) : le reste du corpus (SMC, indicateurs, volume,
// risk, price action, psychologie, wyckoff, options) — enrichissement complet des 67 concepts.
const BATCH_4 = [
  'zone-d-offre',
  'zone-de-demande',
  'changement-de-caractere',
  'fair-value-gap',
  'order-block',
  'bandes-de-bollinger',
  'macd',
  'rsi',
  'divergence',
  'volume',
  'vwap',
  'profil-de-volume',
  'risque-rendement',
  'stop-loss',
  'taille-de-position',
  'impulsion-et-correction',
  'meche-de-rejet',
  'price-action',
  'discipline',
  'fomo',
  'distribution-wyckoff',
  'wyckoff-accumulation',
  'option-call',
  'option-put',
];


/**
 * Verrou de l'enrichissement canonique (Lot 11) : les champs `estimatedMinutes` (durée) et
 * `dialogue` (interventions Toto/Bobo) sont optionnels mais, là où ils existent, bien formés et
 * conformes. Les concepts phares du parcours « Marché expliqué » sont enrichis.
 */
describe('concepts — enrichissement canonique (durée + Toto/Bobo)', () => {
  it('durée et dialogue sont bien formés partout où ils existent', () => {
    for (const c of V5_CONCEPTS) {
      if (c.estimatedMinutes !== undefined) {
        expect(c.estimatedMinutes).toBeGreaterThan(0);
      }
      if (c.dialogue) {
        expect(c.dialogue.toto.trim().length).toBeGreaterThan(0);
        expect(c.dialogue.bobo.trim().length).toBeGreaterThan(0);
        expect(FORBIDDEN.test(`${c.dialogue.toto} ${c.dialogue.bobo}`)).toBe(false);
      }
    }
  });

  it('les concepts phares « Marché expliqué » sont enrichis', () => {
    for (const slug of FLAGSHIP) {
      const c = V5_CONCEPTS.find((x) => x.slug === slug);
      expect(c).toBeDefined();
      expect(c!.estimatedMinutes).toBeGreaterThan(0);
      expect((c!.dialogue?.toto ?? '').length).toBeGreaterThan(0);
      expect((c!.dialogue?.bobo ?? '').length).toBeGreaterThan(0);
    }
  });

  it('le premier parcours débutant (Batch 1) est enrichi de bout en bout', () => {
    for (const slug of BATCH_1) {
      const c = V5_CONCEPTS.find((x) => x.slug === slug);
      expect(c).toBeDefined();
      expect(c!.estimatedMinutes).toBeGreaterThan(0);
      expect((c!.dialogue?.toto ?? '').trim().length).toBeGreaterThan(0);
      expect((c!.dialogue?.bobo ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  it('le monde des chandeliers (Batch 2) est enrichi de bout en bout', () => {
    for (const slug of BATCH_2) {
      const c = V5_CONCEPTS.find((x) => x.slug === slug);
      expect(c).toBeDefined();
      expect(c!.estimatedMinutes).toBeGreaterThan(0);
      expect((c!.dialogue?.toto ?? '').trim().length).toBeGreaterThan(0);
      expect((c!.dialogue?.bobo ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  it('le monde des figures chartistes (Batch 3) est enrichi de bout en bout', () => {
    for (const slug of BATCH_3) {
      const c = V5_CONCEPTS.find((x) => x.slug === slug);
      expect(c).toBeDefined();
      expect(c!.estimatedMinutes).toBeGreaterThan(0);
      expect((c!.dialogue?.toto ?? '').trim().length).toBeGreaterThan(0);
      expect((c!.dialogue?.bobo ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  it('le reste du corpus (Batch 4) est enrichi de bout en bout', () => {
    for (const slug of BATCH_4) {
      const c = V5_CONCEPTS.find((x) => x.slug === slug);
      expect(c).toBeDefined();
      expect(c!.estimatedMinutes).toBeGreaterThan(0);
      expect((c!.dialogue?.toto ?? '').trim().length).toBeGreaterThan(0);
      expect((c!.dialogue?.bobo ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  it('les 67 concepts du corpus sont enrichis (enrichissement complet)', () => {
    for (const c of V5_CONCEPTS) {
      expect(c.estimatedMinutes).toBeGreaterThan(0);
      expect((c.dialogue?.toto ?? '').trim().length).toBeGreaterThan(0);
      expect((c.dialogue?.bobo ?? '').trim().length).toBeGreaterThan(0);
    }
  });
});
