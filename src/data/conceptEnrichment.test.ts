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
});
