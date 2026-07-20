import { describe, it, expect } from '@jest/globals';
import { buildRecognitionSession } from './recognitionTrainer';
import { PATTERN_LIBRARY } from './patternLibrary';

describe('buildRecognitionSession', () => {
  const session = buildRecognitionSession(2024, 8, 4);

  it('produit le nombre de manches demandé, avec cibles distinctes', () => {
    expect(session).toHaveLength(8);
    const ids = new Set(session.map((r) => r.figureId));
    expect(ids.size).toBe(8);
  });

  it('chaque manche est cohérente : bonne réponse présente, options uniques', () => {
    const titles = new Set(PATTERN_LIBRARY.map((g) => g.title));
    for (const r of session) {
      expect(r.options).toHaveLength(4);
      expect(new Set(r.options).size).toBe(4); // pas de doublon
      expect(r.correctIndex).toBeGreaterThanOrEqual(0);
      expect(r.correctIndex).toBeLessThan(r.options.length);
      expect(r.options[r.correctIndex]).toBe(r.title); // l'index pointe le bon intitulé
      for (const o of r.options) expect(titles.has(o)).toBe(true); // intitulés réels de la bibliothèque
      expect(r.spec.datasetKey).toBeTruthy();
    }
  });

  it('est déterministe (même graine → même session)', () => {
    expect(buildRecognitionSession(2024, 8, 4)).toEqual(session);
    expect(buildRecognitionSession(99, 8, 4)).not.toEqual(session);
  });

  it('privilégie des distracteurs de la même famille quand c’est possible', () => {
    // Au moins une manche doit proposer un intitulé d'une figure de la même famille que la cible.
    const familyByTitle = new Map(PATTERN_LIBRARY.map((g) => [g.title, g.family]));
    const anySameFamilyDistractor = session.some((r) =>
      r.options.some((o) => o !== r.title && familyByTitle.get(o) === r.family),
    );
    expect(anySameFamilyDistractor).toBe(true);
  });

  it('borne le nombre de manches à la taille du pool', () => {
    const big = buildRecognitionSession(1, 9999, 4);
    expect(big.length).toBe(PATTERN_LIBRARY.length);
  });
});
