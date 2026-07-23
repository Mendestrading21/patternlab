export { CharacterAvatar, type CharacterAvatarProps } from './CharacterAvatar';
export { MascotAvatar, type MascotAvatarProps } from './MascotAvatar';
export { MascotFigure, type MascotFigureProps, type MascotGesture } from './MascotFigure';
export { Toto, Bobo, type VectorFaceProps } from './vector';
export { FIGURES, IMAGES, type FigureName, type ImageName } from './assets';
export {
  CharacterAnimationController,
  type CharacterAnimationControllerProps,
} from './CharacterAnimationController';
export { CharacterScene, type CharacterSceneProps } from './CharacterScene';
export { useReducedMotion } from './useReducedMotion';
export { type CharacterId, type CharacterState, type Expression, CHARACTER_NAME } from './types';
export {
  STATE_TO_EXPRESSION,
  STATE_TO_DURATION,
  CHARACTER_STATES,
  mascotFor,
  statePriority,
  type CharacterStateSpec,
  type StateCategory,
  type Intensity,
  type HapticKind,
} from './states';
export {
  mascotPresence,
  shouldShowMascot,
  type MascotContext,
  type MascotPresence,
} from './frequency';
export { characterLine, type DialogueLine, type DialogueContext } from './dialogue';
export {
  resolveMascotState,
  pickReaction,
  isCelebration,
  type MascotEvent,
  type MascotEventType,
  type MascotReaction,
} from './orchestrator';
