/**
 * Plan de mouvement d'un avatar — noyau PUR et testable (aucun Reanimated, aucun rendu).
 *
 * `CharacterAnimationController` en dérive ses valeurs animées : ainsi la règle « reduced-motion =
 * statique », l'échelle du pop (dosée par l'intensité de l'état) et « seul idle boucle » sont
 * décidées ici, une seule fois, et vérifiées par des tests purs — sans dépendre du moteur d'animation.
 */
import { CHARACTER_STATES, type Intensity } from './states';
import type { CharacterState } from './types';

/** Plan de mouvement résolu pour un état donné. */
export type MotionPlan =
  /** Reduced-motion : avatar figé, aucune animation (l'information passe par le texte accessible). */
  | { kind: 'static' }
  /** Pop bref au changement d'état (échelle dosée par l'intensité) + flottement en boucle si idle. */
  | { kind: 'animated'; popScale: number; loopFloat: boolean };

/** Échelle du pop bref selon l'intensité (still = aucun agrandissement). */
export function popScale(intensity: Intensity): number {
  return intensity === 'lively' ? 1.14 : intensity === 'still' ? 1.0 : 1.06;
}

/** Seul l'état de repos entretient une boucle (flottement doux) : aucune boucle décorative ailleurs. */
export function loopsFloat(state: CharacterState): boolean {
  return state === 'idle';
}

/** Résout le plan de mouvement d'un état, en respectant d'abord reduced-motion. */
export function motionPlan(state: CharacterState, reduced: boolean): MotionPlan {
  if (reduced) return { kind: 'static' };
  const intensity = CHARACTER_STATES[state]?.intensity ?? 'subtle';
  return { kind: 'animated', popScale: popScale(intensity), loopFloat: loopsFloat(state) };
}
