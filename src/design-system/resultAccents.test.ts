import { describe, it, expect } from '@jest/globals';
import { RESULT_STAT_ACCENT, RESULT_ICON_ACCENT, FORBIDDEN_LEARNING_ACCENTS } from './resultAccents';
import { colors } from './tokens';

/**
 * Verrou LOT 4-A : les accents des métriques d'apprentissage (XP, précision, maîtrise, palier de
 * résultat) restent dans le canon TradeMy — jamais une couleur de marché, de récompense ou d'annotation
 * technique. Empêche une régression silencieuse (ex. « précision » repeinte en cyan technique).
 */
describe('Accents des métriques d’apprentissage (résultat)', () => {
  const all = [...Object.values(RESULT_STAT_ACCENT), ...Object.values(RESULT_ICON_ACCENT)];

  it('aucun accent d’apprentissage n’emprunte marché / récompense / annotation technique', () => {
    for (const c of all) expect(FORBIDDEN_LEARNING_ACCENTS).not.toContain(c);
  });

  it('mapping exact conforme au canon', () => {
    expect(RESULT_STAT_ACCENT.xp).toBe(colors.primary);
    expect(RESULT_STAT_ACCENT.accuracy).toBe(colors.info);
    expect(RESULT_STAT_ACCENT.accuracy).not.toBe(colors.technical); // précision ≠ annotation technique
    expect(RESULT_STAT_ACCENT.mastery).toBe(colors.mastery);
    expect(RESULT_ICON_ACCENT.perfect).toBe(colors.mastery);
    expect(RESULT_ICON_ACCENT.pass).toBe(colors.feedbackCorrect);
    expect(RESULT_ICON_ACCENT.retry).toBe(colors.neutral);
    expect(RESULT_ICON_ACCENT.retry).not.toBe(colors.technical); // « à revoir » ≠ cyan technique
  });
});
