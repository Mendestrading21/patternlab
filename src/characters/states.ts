/**
 * Registre d'états Toto/Bobo — source unique de vérité (LOT 2 : motion system).
 *
 * Chaque état canonique porte sa métadonnée complète :
 *  - expression faciale, personnage par défaut, catégorie, intensité, ton (historique) ;
 *  - LOT 2 : déclencheur, priorité, durée (token motion), interruptible, retour à idle,
 *    texte accessible (équivalent de l'alternative STATIQUE sous reduced-motion),
 *    haptique optionnelle, audio optionnel (toujours désactivé par défaut).
 *
 * L'ALTERNATIVE STATIQUE d'un état = l'avatar rendu avec `expression`, sans mouvement,
 * accompagné de `accessibleText` (aucune information portée par la seule animation).
 * `STATE_TO_EXPRESSION` reste dérivé (aucune duplication).
 */
import type { MotionToken } from '../design-system/tokens';
import type { CharacterId, CharacterState, Expression } from './types';

export type StateCategory = 'guidance' | 'feedback' | 'progress' | 'debate' | 'system';

/** Intensité de la micro-animation : still (aucune), subtle (petit pop), lively (grand pop). */
export type Intensity = 'still' | 'subtle' | 'lively';

/** Retour haptique optionnel (mobile). Jamais bloquant, jamais requis. */
export type HapticKind = 'light' | 'success' | 'warning';

export interface CharacterStateSpec {
  expression: Expression;
  /** Personnage par défaut (null = selon le contexte de l'écran). */
  defaultCharacter: CharacterId | null;
  category: StateCategory;
  intensity: Intensity;
  /** Ton indicatif (aide les écrans, non imposé). */
  tone: string;
  /** Déclencheur pédagogique typique (doc + orchestration événementielle). */
  trigger: string;
  /** Priorité de résolution : un état plus prioritaire n'est jamais écrasé par un moins prioritaire. */
  priority: number;
  /** Durée de la réaction (token motion). */
  duration: MotionToken;
  /** Une réaction en cours peut-elle être interrompue par un nouvel événement ? */
  interruptible: boolean;
  /** Après la réaction, retour automatique à idle (réactions ponctuelles) vs. état maintenu (contexte). */
  returnsToIdle: boolean;
  /** Texte accessible (lecteur d'écran) — jamais « image de ». Équivalent statique de la réaction. */
  accessibleText: string;
  /** Retour haptique optionnel. */
  haptic?: HapticKind;
  /** Audio optionnel — TOUJOURS désactivé par défaut (jamais de voix automatique). */
  audio?: string;
}

export const CHARACTER_STATES: Record<CharacterState, CharacterStateSpec> = {
  idle: { expression: 'neutral', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'présent, discret', trigger: 'état de repos par défaut', priority: 0, duration: 'instant', interruptible: true, returnsToIdle: false, accessibleText: 'Guide présent.' },
  wave: { expression: 'happy', defaultCharacter: 'toto', category: 'guidance', intensity: 'lively', tone: 'salut !', trigger: 'ouverture / accueil', priority: 12, duration: 'expressive', interruptible: true, returnsToIdle: true, accessibleText: 'Le guide te salue.' },
  welcome: { expression: 'happy', defaultCharacter: 'toto', category: 'guidance', intensity: 'lively', tone: 'bienvenue', trigger: 'lesson_started / mission', priority: 12, duration: 'expressive', interruptible: true, returnsToIdle: true, accessibleText: 'Le guide t’accueille.' },
  explain: { expression: 'happy', defaultCharacter: 'toto', category: 'guidance', intensity: 'subtle', tone: 'voici comment…', trigger: 'concept_introduced', priority: 10, duration: 'standard', interruptible: true, returnsToIdle: false, accessibleText: 'Le guide explique le concept.' },
  observe: { expression: 'thinking', defaultCharacter: null, category: 'guidance', intensity: 'subtle', tone: 'regarde bien', trigger: 'chart_revealed', priority: 10, duration: 'standard', interruptible: true, returnsToIdle: false, accessibleText: 'Observe le graphique.' },
  inspect: { expression: 'thinking', defaultCharacter: 'bobo', category: 'guidance', intensity: 'subtle', tone: 'examinons', trigger: 'analyse détaillée', priority: 10, duration: 'standard', interruptible: true, returnsToIdle: false, accessibleText: 'Le guide examine les détails.' },
  think: { expression: 'thinking', defaultCharacter: null, category: 'guidance', intensity: 'subtle', tone: 'réfléchissons', trigger: 'answer_selected (avant validation)', priority: 10, duration: 'standard', interruptible: true, returnsToIdle: false, accessibleText: 'Moment de réflexion.' },
  point: { expression: 'excited', defaultCharacter: 'toto', category: 'guidance', intensity: 'subtle', tone: 'regarde ici', trigger: 'annotation / attention', priority: 12, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Le guide pointe un élément du graphique.' },
  agree: { expression: 'happy', defaultCharacter: 'toto', category: 'debate', intensity: 'subtle', tone: 'plausible', trigger: 'hypothèse plausible', priority: 20, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Hypothèse plausible selon le guide.' },
  disagree: { expression: 'concerned', defaultCharacter: 'bobo', category: 'debate', intensity: 'subtle', tone: 'qu’est-ce qui manque ?', trigger: 'preuve manquante', priority: 22, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Une preuve manque selon le guide.' },
  debate: { expression: 'concerned', defaultCharacter: null, category: 'debate', intensity: 'subtle', tone: 'confrontons les scénarios', trigger: 'confrontation de scénarios', priority: 20, duration: 'standard', interruptible: true, returnsToIdle: false, accessibleText: 'Deux scénarios s’opposent.' },
  encourage: { expression: 'happy', defaultCharacter: 'toto', category: 'feedback', intensity: 'subtle', tone: 'continue, tu progresses', trigger: 'retry_started / result faible', priority: 30, duration: 'expressive', interruptible: true, returnsToIdle: true, accessibleText: 'Encouragement à continuer.' },
  'celebrate-small': { expression: 'happy', defaultCharacter: 'toto', category: 'feedback', intensity: 'lively', tone: 'bien joué !', trigger: 'answer_correct', priority: 35, duration: 'expressive', interruptible: true, returnsToIdle: true, accessibleText: 'Bonne réponse.', haptic: 'success' },
  'celebrate-big': { expression: 'excited', defaultCharacter: 'toto', category: 'feedback', intensity: 'lively', tone: 'bravo !', trigger: 'checkpoint_completed / result parfait', priority: 60, duration: 'celebration', interruptible: false, returnsToIdle: true, accessibleText: 'Bravo, réussite !', haptic: 'success' },
  warning: { expression: 'concerned', defaultCharacter: 'bobo', category: 'feedback', intensity: 'subtle', tone: 'attention au risque', trigger: 'risque / mise en garde', priority: 40, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Attention au risque.', haptic: 'warning' },
  wrong: { expression: 'sad', defaultCharacter: 'bobo', category: 'feedback', intensity: 'subtle', tone: 'pas grave, comprenons', trigger: 'answer_incorrect', priority: 45, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Réponse à revoir, sans gravité.', haptic: 'warning' },
  'false-signal': { expression: 'concerned', defaultCharacter: 'bobo', category: 'feedback', intensity: 'subtle', tone: 'et si c’était un faux signal ?', trigger: 'misconception_detected', priority: 45, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Attention, possible faux signal.', haptic: 'warning' },
  confused: { expression: 'thinking', defaultCharacter: null, category: 'feedback', intensity: 'subtle', tone: 'hmm, pas clair', trigger: 'hint_requested / incertitude', priority: 32, duration: 'standard', interruptible: true, returnsToIdle: true, accessibleText: 'Point pas encore clair.' },
  streak: { expression: 'excited', defaultCharacter: 'toto', category: 'progress', intensity: 'lively', tone: 'série en cours !', trigger: 'streak_earned', priority: 50, duration: 'celebration', interruptible: false, returnsToIdle: true, accessibleText: 'Série de bonnes réponses.', haptic: 'success' },
  'level-up': { expression: 'excited', defaultCharacter: 'toto', category: 'progress', intensity: 'lively', tone: 'niveau supérieur !', trigger: 'level_completed', priority: 65, duration: 'celebration', interruptible: false, returnsToIdle: true, accessibleText: 'Niveau supérieur atteint.', haptic: 'success' },
  review: { expression: 'thinking', defaultCharacter: null, category: 'progress', intensity: 'subtle', tone: 'on consolide', trigger: 'checkpoint_started / révision', priority: 25, duration: 'standard', interruptible: true, returnsToIdle: false, accessibleText: 'Séance de révision.' },
  premium: { expression: 'excited', defaultCharacter: 'toto', category: 'progress', intensity: 'lively', tone: 'contenu avancé', trigger: 'contenu avancé', priority: 26, duration: 'expressive', interruptible: true, returnsToIdle: true, accessibleText: 'Contenu avancé.' },
  rest: { expression: 'neutral', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'au repos', trigger: 'inactivité', priority: 0, duration: 'instant', interruptible: true, returnsToIdle: false, accessibleText: 'Guide au repos.' },
  offline: { expression: 'concerned', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'hors ligne', trigger: 'offline_detected', priority: 90, duration: 'instant', interruptible: false, returnsToIdle: false, accessibleText: 'Hors ligne : le contenu reste disponible.' },
  loading: { expression: 'neutral', defaultCharacter: null, category: 'system', intensity: 'still', tone: 'un instant…', trigger: 'chargement', priority: 5, duration: 'instant', interruptible: true, returnsToIdle: false, accessibleText: 'Chargement.' },
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

/** Priorité d'un état (0 = fond). Aide l'orchestrateur à empêcher deux réactions concurrentes. */
export function statePriority(state: CharacterState): number {
  return CHARACTER_STATES[state].priority;
}

/** Durée (token motion) de la réaction d'un état — DÉRIVÉE du registre. */
export const STATE_TO_DURATION = Object.fromEntries(
  (Object.entries(CHARACTER_STATES) as [CharacterState, CharacterStateSpec][]).map(([s, spec]) => [
    s,
    spec.duration,
  ]),
) as Record<CharacterState, MotionToken>;
