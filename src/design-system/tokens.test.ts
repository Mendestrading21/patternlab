import { describe, it, expect } from '@jest/globals';
import { colors, palette, motion } from './tokens';
import { APP_INFO } from '../lib/appInfo';

/**
 * Verrou de l'identité « Trademy Learning Glass » (Lot 1).
 * Empêche une régression silencieuse : la marque reste violette, le marché reste
 * vert/rouge, et le feedback pédagogique garde des teintes propres.
 * Référence : docs/design/TRADEMY_LEARNING_GLASS.md.
 */
describe('Trademy Learning Glass — sémantique des tokens', () => {
  it('la marque/CTA est violette, jamais une couleur de marché', () => {
    expect(colors.primary).toBe(palette.violet);
    expect(colors.primary).not.toBe(colors.bullish);
    expect(colors.primary).not.toBe(colors.bearish);
  });

  it('marché : vert = haussier, rouge = baissier', () => {
    expect(colors.bullish).toBe(palette.green);
    expect(colors.bearish).toBe(palette.red);
  });

  it('le feedback pédagogique est distinct des couleurs de marché', () => {
    // Une bonne réponse n'est pas une bougie haussière ; une erreur n'est pas une bougie baissière.
    expect(colors.feedbackCorrect).not.toBe(colors.bullish);
    expect(colors.feedbackIncorrect).not.toBe(colors.bearish);
  });

  it('le texte du bouton primaire est le « sur-violet » sombre dédié', () => {
    expect(colors.onPrimary).toBe(palette.onViolet);
  });

  it('les durées de mouvement sont bornées (le mouvement explique, ne décore pas)', () => {
    expect(motion.micro).toBeLessThanOrEqual(200);
    expect(motion.celebration).toBeLessThan(900);
  });

  it('identité publique = Trademy avec sa signature', () => {
    expect(APP_INFO.name).toBe('Trademy');
    expect(APP_INFO.signature).toBe('Ne parie pas. Comprends.');
  });
});
