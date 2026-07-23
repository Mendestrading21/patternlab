/** Constantes produit centralisées. Nom/tagline/disclaimer dérivés de la source unique `appInfo`. */
import { APP_INFO } from './appInfo';

export const APP = {
  name: APP_INFO.name,
  tagline: APP_INFO.tagline,
  promise: 'Apprends, analyse, entraîne-toi, progresse — avec Toto & Bobo.',
} as const;

/** Piliers produit (reference/01-product-vision.md). */
export const PILLARS = [
  { id: 'learn', emoji: '📘', title: 'Apprendre', text: 'Découvre de nouveaux concepts, pas à pas.' },
  { id: 'analyze', emoji: '🔍', title: 'Analyser', text: 'Observe, comprends et interprète les graphiques.' },
  { id: 'train', emoji: '💪', title: 'S’entraîner', text: 'Teste tes connaissances avec des quiz et des défis.' },
  { id: 'progress', emoji: '🏆', title: 'Progresser', text: 'Gagne des récompenses et monte en niveau.' },
] as const;

/** Rappel réglementaire : Trademy est un média/jeu éducatif, pas un conseiller. */
export const DISCLAIMER = APP_INFO.disclaimer;
