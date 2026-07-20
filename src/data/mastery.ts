/** Libellés lisibles des statuts de maîtrise (UI-agnostique : la couleur est choisie côté écran). */
import type { MasteryStatus } from '../engines/learning';

export const MASTERY_LABEL: Record<MasteryStatus, string> = {
  new: 'Nouveau',
  learning: 'En cours',
  fragile: 'Fragile',
  reviewing: 'À consolider',
  strong: 'Solide',
  mastered: 'Maîtrisé',
};
