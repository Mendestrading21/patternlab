/**
 * Carte des assets d'art officiel Toto & Bobo (rendus 3D, dérivés optimisés).
 * Générés par `scripts/prepare-characters/optimize.mjs` depuis `assets/characters/source/`.
 * Metro hashe ces require() et applique le baseUrl (/patternlab) automatiquement sur le web.
 */
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

const DUOS: Record<FigureName, number> = {
  welcome: require('../../assets/characters/cutouts/welcome.png'),
  study: require('../../assets/characters/cutouts/study.png'),
  present: require('../../assets/characters/cutouts/present.png'),
  analyze: require('../../assets/characters/cutouts/analyze.png'),
  celebrate: require('../../assets/characters/cutouts/celebrate.png'),
  'bobo-risk': require('../../assets/characters/cutouts/bobo-risk.png'),
  toto: require('../../assets/characters/cutouts/toto.png'),
  bobo: require('../../assets/characters/cutouts/bobo.png'),
};

/** Poses individuelles détourées (planche fournie, damier retiré). */
const POSES = {
  'toto-point': require('../../assets/characters/poses/toto-point.png'),
  'toto-wave': require('../../assets/characters/poses/toto-wave.png'),
  'toto-read': require('../../assets/characters/poses/toto-read.png'),
  'toto-grad': require('../../assets/characters/poses/toto-grad.png'),
  'toto-glasses': require('../../assets/characters/poses/toto-glasses.png'),
  'toto-magnifier': require('../../assets/characters/poses/toto-magnifier.png'),
  'toto-happy': require('../../assets/characters/poses/toto-happy.png'),
  'toto-run': require('../../assets/characters/poses/toto-run.png'),
  'toto-flex': require('../../assets/characters/poses/toto-flex.png'),
  'bobo-think': require('../../assets/characters/poses/bobo-think.png'),
  'bobo-read': require('../../assets/characters/poses/bobo-read.png'),
  'bobo-laptop': require('../../assets/characters/poses/bobo-laptop.png'),
  'bobo-arms': require('../../assets/characters/poses/bobo-arms.png'),
  'bobo-angry': require('../../assets/characters/poses/bobo-angry.png'),
  'bobo-coffee': require('../../assets/characters/poses/bobo-coffee.png'),
  'bobo-weight': require('../../assets/characters/poses/bobo-weight.png'),
  'bobo-coin': require('../../assets/characters/poses/bobo-coin.png'),
};

/** Toutes les images de personnage adressables par nom (scènes-duo + poses solo). */
export const IMAGES = { ...DUOS, ...POSES };
export type ImageName = keyof typeof IMAGES;
/** @deprecated conservé pour compat — utiliser IMAGES. */
export const FIGURES = DUOS;

// Les avatars ronds sont désormais **vectoriels** (src/characters/vector) : nets à
// toute taille, sans pixelisation ni débordement. Les anciennes têtes JPG sont retirées.
