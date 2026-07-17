/**
 * Carte des figures Toto & Bobo (rendus 3D HD fournis, damier retiré → PNG transparents).
 * Générées par `scripts/prepare-characters/optimize.mjs` (mode `singles`) depuis
 * `assets/characters/source/singles/`. Metro hashe ces require() et applique le baseUrl.
 */

/** Figures détourées (fond transparent) — personnages posés sans cadre. */
export const IMAGES = {
  'toto-wave': require('../../assets/characters/figures/toto-wave.png'),
  'toto-present': require('../../assets/characters/figures/toto-present.png'),
  'toto-read': require('../../assets/characters/figures/toto-read.png'),
  'toto-think': require('../../assets/characters/figures/toto-think.png'),
  'bobo-wave': require('../../assets/characters/figures/bobo-wave.png'),
  'bobo-warning': require('../../assets/characters/figures/bobo-warning.png'),
  celebrate: require('../../assets/characters/figures/celebrate.png'),
  analyze: require('../../assets/characters/figures/analyze.png'),
};
export type ImageName = keyof typeof IMAGES;

/** @deprecated alias de compat. */
export const FIGURES = IMAGES;
export type FigureName = ImageName;

// Les avatars ronds sont **vectoriels** (src/characters/vector) : nets à toute taille.
