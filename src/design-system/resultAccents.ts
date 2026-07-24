import { colors } from './tokens';

/**
 * Accents des MÉTRIQUES D'APPRENTISSAGE de l'écran de résultat (LOT 4-A).
 *
 * Canon TradeMy Learning Glass : le violet porte l'APPRENTISSAGE, la progression et la maîtrise.
 * Une métrique d'apprentissage n'emprunte JAMAIS :
 *   - une couleur de MARCHÉ (`bullish`/`bearish`) ;
 *   - une couleur de ZONE/RÉCOMPENSE (`reward`/or) ;
 *   - l'ANNOTATION TECHNIQUE (`technical`/cyan).
 * Le feedback pédagogique (`feedbackCorrect`) reste autorisé pour un résultat « réussi ».
 */
export const RESULT_STAT_ACCENT = {
  xp: colors.primary, // apprentissage / marque
  accuracy: colors.info, // information (bleu), jamais l'annotation technique cyan
  mastery: colors.mastery, // maîtrise = marque
} as const;

export const RESULT_ICON_ACCENT: Record<'perfect' | 'pass' | 'retry', string> = {
  perfect: colors.mastery, // accomplissement = marque
  pass: colors.feedbackCorrect, // feedback pédagogique positif (autorisé)
  retry: colors.neutral, // neutre — jamais technique ni marché
};

/** Couleurs INTERDITES pour représenter un niveau d'apprentissage. */
export const FORBIDDEN_LEARNING_ACCENTS: readonly string[] = [
  colors.bullish,
  colors.bearish,
  colors.reward,
  colors.technical,
];
