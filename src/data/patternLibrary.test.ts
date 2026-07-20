import { describe, it, expect } from '@jest/globals';
import {
  PATTERN_LIBRARY,
  PATTERN_FAMILIES,
  glyphById,
  glyphsByFamily,
  glyphToVisualSpec,
  patternLibraryIntegrity,
  patternLibraryVocabularyIssues,
} from './patternLibrary';

describe('bibliothèque de figures', () => {
  it('n’est pas vide et couvre les quatre familles', () => {
    expect(PATTERN_LIBRARY.length).toBeGreaterThanOrEqual(20);
    for (const fam of PATTERN_FAMILIES) {
      expect(glyphsByFamily(fam.id).length).toBeGreaterThan(0);
    }
  });

  it('intégrité : ids uniques, familles connues, résumés et datasets présents', () => {
    expect(patternLibraryIntegrity()).toEqual([]);
  });

  it('conformité de vocabulaire : aucun terme prescriptif ni promesse', () => {
    expect(patternLibraryVocabularyIssues()).toEqual([]);
  });

  it('glyphById résout un glyphe connu et rien d’autre', () => {
    expect(glyphById('hammer')?.title).toBe('Marteau');
    expect(glyphById('inconnu')).toBeUndefined();
  });

  it('glyphToVisualSpec produit un VisualSpec rendable (type + dataset + résumé)', () => {
    for (const g of PATTERN_LIBRARY) {
      const spec = glyphToVisualSpec(g);
      expect(spec.type).toBe(g.visualType);
      expect(spec.datasetKey).toBe(g.datasetKey);
      expect(spec.accessibilitySummary.trim().length).toBeGreaterThan(0);
      expect(spec.labels.length).toBe(g.labels.length);
    }
  });

  it('chaque famille déclarée correspond à des glyphes', () => {
    const used = new Set(PATTERN_LIBRARY.map((g) => g.family));
    for (const fam of PATTERN_FAMILIES) expect(used.has(fam.id)).toBe(true);
  });
});
