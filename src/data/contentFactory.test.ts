import { describe, it, expect } from '@jest/globals';
import { checkConceptsIntegrity, conceptVocabularyIssues, WORLDS } from './learningConcept';
import { V5_CONCEPTS } from './learningContent';
import { buildWorldOverview, worldsWithContent } from './worldOverview';
import { VISUAL_DATASETS, SUPPORTED_VISUAL_TYPES } from '../engines/visual/visualDatasets';
import { SKILLS } from './seed';

const skillIds = new Set(SKILLS.map((s) => s.id));

/**
 * Portail de la fabrique de contenu (Lot 9) : garde-fou qui monte en charge avec le corpus.
 * Chaque nouveau lot éditorial doit passer ce portail avant d'augmenter le volume.
 */
describe('fabrique de contenu — portail de qualité du corpus V5', () => {
  it('le corpus a grandi (premier lot éditorial riche)', () => {
    expect(V5_CONCEPTS.length).toBeGreaterThanOrEqual(12);
  });

  it('ids et slugs uniques sur tout le corpus', () => {
    expect(new Set(V5_CONCEPTS.map((c) => c.id)).size).toBe(V5_CONCEPTS.length);
    expect(new Set(V5_CONCEPTS.map((c) => c.slug)).size).toBe(V5_CONCEPTS.length);
  });

  it('intégrité et vocabulaire propres sur tout le corpus', () => {
    expect(checkConceptsIntegrity(V5_CONCEPTS, { skillIds })).toEqual([]);
    for (const c of V5_CONCEPTS) expect(conceptVocabularyIssues(c)).toEqual([]);
  });

  it('tout le corpus reste needsReview (jamais auto-publié)', () => {
    expect(V5_CONCEPTS.every((c) => c.status === 'needsReview')).toBe(true);
  });

  it('chaque visuel est rendable (type supporté + dataset présent)', () => {
    for (const c of V5_CONCEPTS) {
      const spec = c.visualSpec;
      if (!spec) continue;
      expect(SUPPORTED_VISUAL_TYPES).toContain(spec.type);
      if (spec.datasetKey) {
        expect(VISUAL_DATASETS[spec.datasetKey]?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it('la couverture des mondes progresse (≥ 5 mondes ouverts)', () => {
    const overview = buildWorldOverview(WORLDS, V5_CONCEPTS);
    expect(worldsWithContent(overview)).toBeGreaterThanOrEqual(5);
  });
});
