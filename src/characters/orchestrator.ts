/**
 * Orchestration événement → état mascotte (LOT 2, pur et testable).
 *
 * Les écrans émettent des ÉVÉNEMENTS pédagogiques ; l'orchestrateur les traduit en un état
 * canonique (registre `CHARACTER_STATES`) sans dupliquer la vérité pédagogique (le TEXTE reste
 * produit par `characterLine`/`mistakeMoment`/le concept actif). La résolution de priorité
 * empêche deux réactions concurrentes : une célébration non interruptible n'est écrasée que par
 * un événement système strictement plus prioritaire (ex. hors-ligne).
 */
import { CHARACTER_STATES, mascotFor, type HapticKind } from './states';
import type { CharacterId, CharacterState } from './types';

/** Événements pédagogiques typés qui pilotent les mascottes. */
export type MascotEvent =
  | { type: 'lesson_started' }
  | { type: 'concept_introduced' }
  | { type: 'chart_revealed' }
  | { type: 'answer_selected' }
  | { type: 'answer_correct'; streak?: number }
  | { type: 'answer_incorrect' }
  | { type: 'misconception_detected' }
  | { type: 'hint_requested' }
  | { type: 'retry_started' }
  | { type: 'checkpoint_started' }
  | { type: 'checkpoint_completed'; passed: boolean }
  | { type: 'streak_earned' }
  | { type: 'level_completed' }
  | { type: 'session_resumed' }
  | { type: 'offline_detected' }
  | { type: 'online_restored' };

export type MascotEventType = MascotEvent['type'];

export interface MascotReaction {
  state: CharacterState;
  character: CharacterId;
  priority: number;
  interruptible: boolean;
  returnsToIdle: boolean;
  accessibleText: string;
  haptic?: HapticKind;
}

/** État canonique par type d'événement (les nuances sont traitées dans `resolveMascotState`). */
const EVENT_STATE: Record<MascotEventType, CharacterState> = {
  lesson_started: 'welcome',
  concept_introduced: 'explain',
  chart_revealed: 'observe',
  answer_selected: 'think',
  answer_correct: 'celebrate-small',
  answer_incorrect: 'wrong',
  misconception_detected: 'false-signal',
  hint_requested: 'confused',
  retry_started: 'encourage',
  checkpoint_started: 'review',
  checkpoint_completed: 'celebrate-big',
  streak_earned: 'streak',
  level_completed: 'level-up',
  session_resumed: 'welcome', // ré-accueil discret — JAMAIS une célébration rejouée
  offline_detected: 'offline',
  online_restored: 'idle',
};

/** Traduit un événement en réaction mascotte (état + personnage + métadonnées). */
export function resolveMascotState(event: MascotEvent): MascotReaction {
  let state = EVENT_STATE[event.type];
  // Nuances pédagogiques :
  // - une bonne réponse en série (≥ 3) devient une réaction « série » ;
  if (event.type === 'answer_correct' && (event.streak ?? 0) >= 3) state = 'streak';
  // - un checkpoint ÉCHOUÉ n'est jamais célébré : on encourage.
  if (event.type === 'checkpoint_completed' && !event.passed) state = 'encourage';

  const spec = CHARACTER_STATES[state];
  return {
    state,
    character: mascotFor(state).character,
    priority: spec.priority,
    interruptible: spec.interruptible,
    returnsToIdle: spec.returnsToIdle,
    accessibleText: spec.accessibleText,
    haptic: spec.haptic,
  };
}

/**
 * Résout la concurrence entre la réaction en cours et une nouvelle. Empêche deux réactions
 * simultanées : une réaction NON interruptible reste, sauf si la nouvelle est strictement plus
 * prioritaire (système critique). Sinon la plus prioritaire l'emporte (égalité → la plus récente).
 */
export function pickReaction(current: MascotReaction | null, next: MascotReaction): MascotReaction {
  if (!current) return next;
  if (!current.interruptible) {
    return next.priority > current.priority ? next : current;
  }
  return next.priority >= current.priority ? next : current;
}

/** Une réaction issue d'un événement est-elle une célébration ? (garde-fou reprise de session). */
export function isCelebration(reaction: MascotReaction): boolean {
  return reaction.state === 'celebrate-small' || reaction.state === 'celebrate-big' || reaction.state === 'streak' || reaction.state === 'level-up';
}
