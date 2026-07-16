/** Constantes produit centralisées. */
export const APP = {
  name: 'PatternLab',
  tagline: 'Apprends à lire les marchés, quelques minutes par jour.',
  promise: 'Apprends, analyse, entraîne-toi, progresse — avec Toto & Bobo.',
} as const;

/** Piliers produit (reference/01-product-vision.md). */
export const PILLARS = [
  { id: 'learn', emoji: '📘', title: 'Apprendre', text: 'Découvre de nouveaux concepts, pas à pas.' },
  { id: 'analyze', emoji: '🔍', title: 'Analyser', text: 'Observe, comprends et interprète les graphiques.' },
  { id: 'train', emoji: '💪', title: 'S’entraîner', text: 'Teste tes connaissances avec des quiz et des défis.' },
  { id: 'progress', emoji: '🏆', title: 'Progresser', text: 'Gagne des récompenses et monte en niveau.' },
] as const;

/** Rappel réglementaire : PatternLab est un média/jeu éducatif, pas un conseiller. */
export const DISCLAIMER =
  'PatternLab est une application éducative. Aucun conseil en investissement, aucun signal d’achat ou de vente, aucune promesse de gain.';
