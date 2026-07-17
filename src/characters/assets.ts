/**
 * Carte des assets d'art officiel Toto & Bobo (rendus 3D, dérivés optimisés).
 * Générés par `scripts/prepare-characters/optimize.mjs` depuis `assets/characters/source/`.
 * Metro hashe ces require() et applique le baseUrl (/patternlab) automatiquement sur le web.
 */
import type { CharacterId, Expression } from './types';

/** Figures détourées (fond transparent) — personnages posés sans cadre. */
export type FigureName =
  | 'welcome'
  | 'study'
  | 'present'
  | 'analyze'
  | 'celebrate'
  | 'bobo-risk'
  | 'toto'
  | 'bobo';

export const FIGURES: Record<FigureName, number> = {
  welcome: require('../../assets/characters/cutouts/welcome.png'),
  study: require('../../assets/characters/cutouts/study.png'),
  present: require('../../assets/characters/cutouts/present.png'),
  analyze: require('../../assets/characters/cutouts/analyze.png'),
  celebrate: require('../../assets/characters/cutouts/celebrate.png'),
  'bobo-risk': require('../../assets/characters/cutouts/bobo-risk.png'),
  toto: require('../../assets/characters/cutouts/toto.png'),
  bobo: require('../../assets/characters/cutouts/bobo.png'),
};

/** Têtes rondes (avatars), par personnage. */
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
 * Chaque expression est mappée vers une tête existante (repli sur la plus proche).
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
