// Rôles pédagogiques des guides (pur, sans dépendance UI — testable directement).
import type { CharacterId } from './types';

/** Rôle pédagogique canonique de chaque guide (Toto/Bobo). */
export const GUIDE_ROLE: Record<CharacterId, string> = {
  toto: 'Taureau vert · formule les hypothèses et cherche la reprise possible.',
  bobo: 'Ours rouge · vérifie la preuve, le risque et le faux signal.',
};

/** État d'avatar utilisé pour présenter chaque guide dans la carte de choix. */
export const GUIDE_PRESENT_STATE: Record<CharacterId, 'welcome' | 'inspect'> = {
  toto: 'welcome',
  bobo: 'inspect',
};
