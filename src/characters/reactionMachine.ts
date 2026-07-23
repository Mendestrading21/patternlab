/**
 * Machine de réaction mascotte — noyau PUR et déterministe (aucun React, aucun Reanimated).
 *
 * C'est le cerveau que `useMascotReactions` habille de timers. Il conserve la réaction active,
 * applique `pickReaction` (priorités + interruptible), programme le retour à idle en fonction de la
 * DURÉE réelle de l'état (token motion → ms) et arbitre les cas système (hors-ligne prioritaire,
 * retour en ligne qui libère). Le TEXTE pédagogique n'est jamais produit ici : il est fourni par
 * l'appelant (`characterLine`/`mistakeMoment`/concept) et transporté tel quel avec la réaction.
 */
import { resolveMascotState, pickReaction, type MascotEvent, type MascotReaction } from './orchestrator';
import { STATE_TO_DURATION } from './states';
import { motion } from '../design-system/tokens';
import type { CharacterId, CharacterState } from './types';

/** États « neutres » que le guide choisi peut porter (introductions, observations, encouragements).
 *  Les états à rôle canonique (célébration = Toto ; faux signal / erreur / risque = Bobo ; explication
 *  = Toto) ne sont JAMAIS réattribués : choisir un guide ne neutralise pas les rôles pédagogiques. */
export const GUIDE_CARRIED_STATES: ReadonlySet<CharacterState> = new Set<CharacterState>([
  'welcome',
  'observe',
  'encourage',
]);

/** Durée réelle d'une réaction en millisecondes = token motion associé à l'état (source unique). */
export function durationMs(state: CharacterState): number {
  return motion[STATE_TO_DURATION[state]];
}

/** Réaction d'un événement, avec le guide choisi porté sur les seuls états neutres. */
export function resolveWithGuide(event: MascotEvent, guide?: CharacterId | null): MascotReaction {
  const reaction = resolveMascotState(event);
  if (guide && GUIDE_CARRIED_STATES.has(reaction.state)) {
    return { ...reaction, character: guide };
  }
  return reaction;
}

export interface ReactionState {
  /** Réaction dominante courante (null = idle, aucune scène). */
  active: MascotReaction | null;
  /** Texte pédagogique associé à la réaction active (jamais dérivé du registre d'animation). */
  speech?: string;
  /** Horodatage (ms) du retour automatique à idle, ou null si la réaction est maintenue. */
  idleAt: number | null;
}

export function initialReactionState(): ReactionState {
  return { active: null, speech: undefined, idleAt: null };
}

export interface SendOptions {
  guide?: CharacterId | null;
  /** Texte pédagogique à afficher si cette réaction devient dominante. */
  speech?: string;
}

/**
 * Applique un événement. `pickReaction` décide si la nouvelle réaction l'emporte : une réaction non
 * interruptible n'est écrasée que par une priorité strictement supérieure. La reprise (`session_resumed`)
 * ne rejoue jamais une célébration (l'orchestrateur la résout en `welcome`). `online_restored` libère
 * uniquement l'état hors-ligne (une réaction idle ne pourrait pas l'écraser via les priorités).
 */
export function sendEvent(state: ReactionState, event: MascotEvent, now: number, opts: SendOptions = {}): ReactionState {
  // Retour en ligne : libère explicitement l'état hors-ligne (sinon idle ne peut pas l'écraser).
  if (event.type === 'online_restored') {
    return state.active?.state === 'offline' ? initialReactionState() : state;
  }

  const next = resolveWithGuide(event, opts.guide);
  const winner = pickReaction(state.active, next);
  if (winner === state.active) {
    // La réaction en cours (non interruptible / plus prioritaire) est conservée : rien ne change.
    return state;
  }
  const idleAt = next.returnsToIdle ? now + durationMs(next.state) : null;
  return { active: next, speech: opts.speech, idleAt };
}

/** Fait avancer le temps : si l'échéance de retour à idle est atteinte, la réaction s'efface. */
export function tick(state: ReactionState, now: number): ReactionState {
  if (state.idleAt != null && now >= state.idleAt) {
    return initialReactionState();
  }
  return state;
}
