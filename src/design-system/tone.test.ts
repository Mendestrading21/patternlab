import { describe, it, expect } from '@jest/globals';
import { difficultyTone, clampDifficulty } from './tone';
import { colors } from './tokens';

describe('clampDifficulty', () => {
  it('borne dans [1, 5] et arrondit', () => {
    expect(clampDifficulty(0)).toBe(1);
    expect(clampDifficulty(9)).toBe(5);
    expect(clampDifficulty(2.6)).toBe(3);
    expect(clampDifficulty(4.4)).toBe(4);
  });
  it('renvoie 1 pour NaN', () => {
    expect(clampDifficulty(Number.NaN)).toBe(1);
  });
});

describe('difficultyTone', () => {
  it('Découverte (technique) pour 1–2', () => {
    expect(difficultyTone(1)).toEqual({ label: 'Découverte', color: colors.technical });
    expect(difficultyTone(2).label).toBe('Découverte');
  });
  it('Intermédiaire (ambre) pour 3', () => {
    expect(difficultyTone(3)).toEqual({ label: 'Intermédiaire', color: colors.warning });
  });
  it('Avancé (violet) pour 4–5', () => {
    expect(difficultyTone(4).color).toBe(colors.advanced);
    expect(difficultyTone(5)).toEqual({ label: 'Avancé', color: colors.advanced });
  });
  it('borne les valeurs hors plage', () => {
    expect(difficultyTone(0).label).toBe('Découverte');
    expect(difficultyTone(12).label).toBe('Avancé');
  });
});
