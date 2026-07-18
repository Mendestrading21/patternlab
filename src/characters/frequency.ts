/**
 * Gouverneur de présence des mascottes — pur et testable.
 * Toto/Bobo doivent être utiles (onboarding, feedback, débat, réussite) mais DISCRETS
 * dans les listes denses, les réglages et les interactions graphiques précises
 * (règle du skill). Ce module centralise cette décision.
 */
export type MascotContext =
  | 'onboarding'
  | 'lessonStep'
  | 'feedback'
  | 'debate'
  | 'result'
  | 'home'
  | 'review'
  | 'denseList'
  | 'settings'
  | 'chartPrecise';

export type MascotPresence = 'full' | 'compact' | 'hidden';

/** Présence recommandée selon le contexte. */
export function mascotPresence(context: MascotContext): MascotPresence {
  switch (context) {
    case 'denseList':
    case 'settings':
    case 'chartPrecise':
      return 'hidden'; // discret : pas de mascotte qui gêne
    case 'home':
    case 'review':
      return 'compact'; // présence légère (une seule, petite)
    default:
      return 'full'; // onboarding, lessonStep, feedback, debate, result
  }
}

export function shouldShowMascot(context: MascotContext): boolean {
  return mascotPresence(context) !== 'hidden';
}
