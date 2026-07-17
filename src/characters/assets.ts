/**
 * Carte des assets d'art officiel Toto & Bobo (rendus 3D, dérivés optimisés).
 * Générés par `scripts/prepare-characters/optimize.mjs` depuis `assets/characters/source/`.
 * Metro hashe ces require() et applique le baseUrl (/patternlab) automatiquement sur le web.
 */
import type { CharacterId, Expression } from './types';

/** Grandes illustrations de scène (panneaux). */
export type SceneMoment =
  | 'welcome'
  | 'study'
  | 'present'
  | 'analyze'
  | 'warning'
  | 'celebrate'
  | 'bobo-risk';

export const SCENES: Record<SceneMoment, number> = {
  welcome: require('../../assets/characters/scenes/welcome-duo.jpg'),
  study: require('../../assets/characters/scenes/study-duo.jpg'),
  present: require('../../assets/characters/scenes/present-toto.jpg'),
  analyze: require('../../assets/characters/scenes/analyze-duo.jpg'),
  warning: require('../../assets/characters/scenes/warning-duo.jpg'),
  celebrate: require('../../assets/characters/scenes/celebrate-duo.jpg'),
  'bobo-risk': require('../../assets/characters/scenes/bobo-risk.jpg'),
};

/** Têtes disponibles réellement découpées, par personnage. */
const TOTO_HEADS = {
  happy: require('../../assets/characters/heads/toto-happy.jpg'),
  thinking: require('../../assets/characters/heads/toto-thinking.jpg'),
  concerned: require('../../assets/characters/heads/toto-concerned.jpg'),
  excited: require('../../assets/characters/heads/toto-excited.jpg'),
  neutral: require('../../assets/characters/heads/toto-neutral.jpg'),
};
const BOBO_HEADS = {
  happy: require('../../assets/characters/heads/bobo-happy.jpg'),
  concerned: require('../../assets/characters/heads/bobo-concerned.jpg'),
  sad: require('../../assets/characters/heads/bobo-sad.jpg'),
  thinking: require('../../assets/characters/heads/bobo-thinking.jpg'),
  neutral: require('../../assets/characters/heads/bobo-neutral.jpg'),
};

/**
 * Renvoie la tête (source image) pour un personnage + une expression.
 * Chaque expression du type `Expression` est mappée vers une tête existante
 * (repli sur la plus proche, puis sur `neutral`).
 */
export function headSource(character: CharacterId, expr: Expression): number {
  if (character === 'toto') {
    const map: Record<Expression, number> = {
      happy: TOTO_HEADS.happy,
      excited: TOTO_HEADS.happy,
      thinking: TOTO_HEADS.thinking,
      concerned: TOTO_HEADS.concerned,
      sad: TOTO_HEADS.concerned,
      neutral: TOTO_HEADS.neutral,
    };
    return map[expr] ?? TOTO_HEADS.neutral;
  }
  const map: Record<Expression, number> = {
    happy: BOBO_HEADS.happy,
    excited: BOBO_HEADS.happy,
    thinking: BOBO_HEADS.thinking,
    concerned: BOBO_HEADS.concerned,
    sad: BOBO_HEADS.sad,
    neutral: BOBO_HEADS.neutral,
  };
  return map[expr] ?? BOBO_HEADS.neutral;
}
