import { CharacterScene } from './CharacterScene';
import { resolveMascotState, type MascotEvent } from './orchestrator';
import type { CharacterId } from './types';

export interface MascotEventSceneProps {
  /** Événement pédagogique — résolu en état + personnage par l'orchestrateur. */
  event: MascotEvent;
  /** Texte de la bulle (produit par la pédagogie : `characterLine`/`mistakeMoment`/concept). */
  speech?: string;
  size?: number;
  showName?: boolean;
  reversed?: boolean;
  /** Force le personnage (sinon celui résolu par l'orchestrateur depuis l'état). */
  character?: CharacterId;
}

/**
 * Rend la réaction mascotte d'un ÉVÉNEMENT pédagogique : l'orchestrateur (`resolveMascotState`)
 * choisit l'état canonique et le personnage ; le TEXTE reste fourni par la pédagogie (jamais
 * dupliqué ici). C'est le pont événement → état → rendu, utilisé pour les réactions transverses
 * (ex. bannière hors-ligne) sans recopier la logique de priorité dans les écrans.
 *
 * L'alternative statique (reduced-motion) et le texte accessible sont pris en charge en aval par
 * `CharacterAnimationController` (avatar vectoriel inline, aucun asset réseau requis).
 */
export function MascotEventScene({ event, speech, size, showName, reversed, character }: MascotEventSceneProps) {
  const reaction = resolveMascotState(event);
  return (
    <CharacterScene
      character={character ?? reaction.character}
      state={reaction.state}
      size={size}
      speech={speech}
      showName={showName}
      reversed={reversed}
    />
  );
}
