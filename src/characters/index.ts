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
  CHARACTER_STATES,
  mascotFor,
  type CharacterStateSpec,
  type StateCategory,
  type Intensity,
} from './states';
export {
  mascotPresence,
  shouldShowMascot,
  type MascotContext,
  type MascotPresence,
} from './frequency';
