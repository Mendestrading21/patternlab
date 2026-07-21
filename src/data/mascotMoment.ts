/**
 * MascotMoment (Learning-Master Lot 9) — un « moment » contextuel de Toto/Bobo, pur et déterministe.
 *
 * Un moment décrit une intervention pédagogique de la mascotte : quel personnage, quel état
 * (expression/geste), quelle réplique, et son rôle. Sous réduction d'animation, le moment est rendu
 * statiquement (l'entrée/le pointage/la sortie se réduisent à un état + une bulle) — jamais bloquant.
 *
 * Nouveauté du lot : les moments d'ERREUR sont **liés à l'idée fausse** (misconception du Lot 7)
 * derrière l'exercice raté — Bobo pointe la confusion précise, plus un « réessaie » générique.
 */
import type { CharacterId, CharacterState } from '../characters/types';
import { misconceptionIdForExercise, MISCONCEPTIONS } from './misconceptions';

export type MomentRole = 'mistake' | 'encourage';

export interface MascotMoment {
  character: CharacterId;
  state: CharacterState;
  text: string;
  role: MomentRole;
  /** Id de misconception ciblée (moments d'erreur) — utile aux tests/analytics. */
  misconceptionId?: string;
}

const BY_ID = new Map(MISCONCEPTIONS.map((m) => [m.id, m]));

/**
 * Moment d'erreur : Bobo pointe l'idée fausse derrière l'exercice raté. Le texte reprend le libellé
 * et le conseil de la misconception rattachée à l'exercice (résolution du Lot 7).
 */
export function mistakeMoment(exerciseId: string): MascotMoment {
  const id = misconceptionIdForExercise(exerciseId);
  const m = BY_ID.get(id);
  const text = m ? `${m.label} — ${m.hint}` : 'Regarde pourquoi c’était faux, puis réessaie.';
  return { character: 'bobo', state: 'false-signal', text, role: 'mistake', misconceptionId: m?.id };
}
