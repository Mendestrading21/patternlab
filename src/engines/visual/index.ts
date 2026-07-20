/** Moteur de visuels V5 — géométrie pure, datasets déterministes, composants SVG. */
export * from './candleGeometry';
export * from './visualDatasets';
export {
  CandlestickGlyphs,
  type Level,
  type Zone,
  type Guide,
  type GuidePoint,
  type Marker,
} from './components/CandlestickGlyphs';
export { CandleAnatomy } from './components/CandleAnatomy';
export { VisualCard } from './components/VisualCard';
export { FIGURE_OVERLAYS, figureOverlay, type FigureOverlay } from './figureOverlays';
