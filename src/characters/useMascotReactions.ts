/**
 * Contrôleur de réactions mascotte — hook UNIQUE et testable (aucune logique dans les écrans).
 *
 * Enveloppe la machine PURE `reactionMachine` avec de vrais timers : conserve la réaction active,
 * applique `pickReaction` (via `sendEvent`), empêche deux réactions concurrentes, respecte priorité
 * et interruptible, programme le retour à idle selon la durée réelle de l'état, annule proprement son
 * timer au démontage et ne bloque JAMAIS la navigation (aucun await, aucun verrou). Le texte
 * pédagogique est transporté tel quel (jamais produit ici).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  initialReactionState,
  sendEvent,
  tick,
  type ReactionState,
} from './reactionMachine';
import type { MascotEvent, MascotReaction } from './orchestrator';
import type { CharacterId } from './types';

export interface MascotController {
  /** Réaction dominante à afficher (null = aucune scène). */
  reaction: MascotReaction | null;
  /** Texte pédagogique associé (fourni par l'appelant, pas par le registre d'animation). */
  speech?: string;
  /** Émet un événement pédagogique ; met éventuellement à jour la réaction dominante. */
  emit: (event: MascotEvent, speech?: string) => void;
}

export function useMascotReactions(guide?: CharacterId | null): MascotController {
  const [view, setView] = useState<{ reaction: MascotReaction | null; speech?: string }>({
    reaction: null,
    speech: undefined,
  });
  const stateRef = useRef<ReactionState>(initialReactionState());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const publish = useCallback(() => {
    setView({ reaction: stateRef.current.active, speech: stateRef.current.speech });
  }, []);

  const scheduleIdle = useCallback(() => {
    clearTimer();
    const { idleAt } = stateRef.current;
    if (idleAt == null) return;
    const delay = Math.max(0, idleAt - Date.now());
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      stateRef.current = tick(stateRef.current, Date.now());
      publish();
    }, delay);
  }, [clearTimer, publish]);

  const emit = useCallback(
    (event: MascotEvent, speech?: string) => {
      stateRef.current = sendEvent(stateRef.current, event, Date.now(), {
        guide: guide ?? undefined,
        speech,
      });
      publish();
      scheduleIdle();
    },
    [guide, publish, scheduleIdle],
  );

  // Démontage : annule le timer de retour à idle (aucun timer orphelin, aucune fuite).
  useEffect(() => clearTimer, [clearTimer]);

  return { reaction: view.reaction, speech: view.speech, emit };
}
