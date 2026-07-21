import { describe, it, expect } from '@jest/globals';
import { searchFigures, PATTERN_LIBRARY } from './patternLibrary';

describe('searchFigures — recherche dans la bibliothèque visuelle', () => {
  it('requête vide → toutes les figures', () => {
    expect(searchFigures('')).toHaveLength(PATTERN_LIBRARY.length);
    expect(searchFigures('   ')).toHaveLength(PATTERN_LIBRARY.length);
  });

  it('trouve par titre (insensible aux accents/casse)', () => {
    const r = searchFigures('MARTEAU');
    expect(r.some((g) => g.title === 'Marteau')).toBe(true);
    expect(searchFigures('marteau').length).toBeGreaterThan(0);
  });

  it('trouve par alias anglais', () => {
    const r = searchFigures('hammer');
    expect(r.some((g) => g.title === 'Marteau')).toBe(true);
  });

  it('trouve par famille', () => {
    const r = searchFigures('indicateur');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((g) => g.family === 'indicateur')).toBe(true);
  });

  it('requête sans correspondance → vide', () => {
    expect(searchFigures('zzzznope')).toEqual([]);
  });
});
