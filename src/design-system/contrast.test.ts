import { describe, it, expect } from '@jest/globals';
import { contrastRatio, relativeLuminance, meetsAA, hexToRgb, WCAG_AA_NORMAL } from './contrast';
import { colors } from './tokens';

describe('contrast (WCAG)', () => {
  it('calcule les cas de référence', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
    expect(contrastRatio('#111111', '#111111')).toBeCloseTo(1, 5);
  });

  it('meetsAA distingue au-dessus/au-dessous du seuil', () => {
    expect(meetsAA('#FFFFFF', '#000000')).toBe(true);
    expect(meetsAA('#777777', '#808080')).toBe(false);
  });
});

const SURFACES = ['background', 'surface', 'surfaceElevated', 'surfaceInteractive'] as const;

describe('accessibilité de la palette Instrument Glass (AA ≥ 4.5)', () => {
  it.each(SURFACES)('textPrimary lisible sur %s', (s) => {
    expect(contrastRatio(colors.textPrimary, colors[s])).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  it.each(SURFACES)('textSecondary lisible sur %s', (s) => {
    expect(contrastRatio(colors.textSecondary, colors[s])).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  it.each(SURFACES)('textMuted lisible sur %s (captions incluses)', (s) => {
    expect(contrastRatio(colors.textMuted, colors[s])).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });

  it('les couleurs d’accent restent lisibles comme texte sur surface', () => {
    for (const accent of [colors.primary, colors.feedbackIncorrect, colors.warning, colors.technical, colors.reward]) {
      expect(contrastRatio(accent, colors.surface)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    }
  });

  it('les textes « on-couleur » des boutons sont lisibles', () => {
    expect(contrastRatio(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    expect(contrastRatio(colors.onReward, colors.reward)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
  });
});
