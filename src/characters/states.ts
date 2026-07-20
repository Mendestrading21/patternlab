/**
 * Registre d'états Toto/Bobo V2 — source unique de vérité.
 * Chaque état canonique porte : expression faciale, personnage par défaut, catégorie,
 * intensité d'animation (ignorée si reduced motion) et un ton indicatif.
 * `STATE_TO_EXPRESSION` en est dérivé (aucune duplication).
 */
import type { CharacterId, CharacterState, Expression } from './types';

export type StateCategory = 'guidance' | 'feedback' | 'progress' | 'debate' | 'system';

/** Intensité de la micro-animation : still (aucune), subtle (petit pop), lively (grand pop). */
export type Intensity = 'still' | 'subtle' | 'lively';

export interface CharacterStateSpec {
  expression: Expression;
  /** Personnage par défaut (null = selon le contexte de l'écran). */
  defaultCharacter: CharacterId | null;
  category: StateCategory;
  intensity: Intensity;
  /** Ton indicatif (aide les écrans, non imposé). */
  tone: string;
}

export const CHARACTER_STATES: Record<CharacterState, CharacterStateSpec> = {
  idle: { expression: 'neutral', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'présent, discret' },
  wave: { expression: 'happy', defaultCharacter: 'toto', category: 'guidance', intensity: 'lively', tone: 'salut !' },
  welcome: { expression: 'happy', defaultCharacter: 'toto', category: 'guidance', intensity: 'lively', tone: 'bienvenue' },
  explain: { expression: 'happy', defaultCharacter: 'toto', category: 'guidance', intensity: 'subtle', tone: 'voici comment…' },
  observe: { expression: 'thinking', defaultCharacter: null, category: 'guidance', intensity: 'subtle', tone: 'regarde bien' },
  inspect: { expression: 'thinking', defaultCharacter: 'bobo', category: 'guidance', intensity: 'subtle', tone: 'examinons' },
  think: { expression: 'thinking', defaultCharacter: null, category: 'guidance', intensity: 'subtle', tone: 'réfléchissons' },
  agree: { expression: 'happy', defaultCharacter: 'toto', category: 'debate', intensity: 'subtle', tone: 'plausible' },
  disagree: { expression: 'concerned', defaultCharacter: 'bobo', category: 'debate', intensity: 'subtle', tone: 'qu’est-ce qui manque ?' },
  debate: { expression: 'concerned', defaultCharacter: null, category: 'debate', intensity: 'subtle', tone: 'confrontons les scénarios' },
  encourage: { expression: 'happy', defaultCharacter: 'toto', category: 'feedback', intensity: 'subtle', tone: 'continue, tu progresses' },
  'celebrate-small': { expression: 'happy', defaultCharacter: 'toto', category: 'feedback', intensity: 'lively', tone: 'bien joué !' },
  'celebrate-big': { expression: 'excited', defaultCharacter: 'toto', category: 'feedback', intensity: 'lively', tone: 'bravo !' },
  warning: { expression: 'concerned', defaultCharacter: 'bobo', category: 'feedback', intensity: 'subtle', tone: 'attention au risque' },
  wrong: { expression: 'sad', defaultCharacter: 'bobo', category: 'feedback', intensity: 'subtle', tone: 'pas grave, comprenons' },
  'false-signal': { expression: 'concerned', defaultCharacter: 'bobo', category: 'feedback', intensity: 'subtle', tone: 'et si c’était un faux signal ?' },
  confused: { expression: 'thinking', defaultCharacter: null, category: 'feedback', intensity: 'subtle', tone: 'hmm, pas clair' },
  streak: { expression: 'excited', defaultCharacter: 'toto', category: 'progress', intensity: 'lively', tone: 'série en cours !' },
  'level-up': { expression: 'excited', defaultCharacter: 'toto', category: 'progress', intensity: 'lively', tone: 'niveau supérieur !' },
  review: { expression: 'thinking', defaultCharacter: null, category: 'progress', intensity: 'subtle', tone: 'on consolide' },
  premium: { expression: 'excited', defaultCharacter: 'toto', category: 'progress', intensity: 'lively', tone: 'contenu avancé' },
  rest: { expression: 'neutral', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'au repos' },
  offline: { expression: 'concerned', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'hors ligne' },
  loading: { expression: 'neutral', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'un instant…' },
};

/** Expression faciale par état — DÉRIVÉE du registre (source unique). */
export const STATE_TO_EXPRESSION = Object.fromEntries(
  (Object.entries(CHARACTER_STATES) as [CharacterState, CharacterStateSpec][]).map(([s, spec]) => [
    s,
    spec.expression,
  ]),
) as Record<CharacterState, Expression>;

/** Résout le personnage + l'expression + le ton pour un état (le personnage explicite prime). */
export function mascotFor(
  state: CharacterState,
  character?: CharacterId,
): { character: CharacterId; expression: Expression; tone: string } {
  const spec = CHARACTER_STATES[state];
  return {
    character: character ?? spec.defaultCharacter ?? 'toto',
    expression: spec.expression,
    tone: spec.tone,
  };
}
