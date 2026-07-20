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
export { IndicatorPanel } from './components/IndicatorPanel';
export { OptionPayoff, type OptionKind } from './components/OptionPayoff';
export { MiniVisual } from './components/MiniVisual';
export { VisualCard } from './components/VisualCard';
export { FIGURE_OVERLAYS, figureOverlay, type FigureOverlay } from './figureOverlays';
export { RISK_SETUPS, riskSetup, type RiskSetup } from './riskSetups';
export * from './indicatorMath';
export { INDICATOR_CONFIGS, indicatorConfig, type IndicatorConfig, type IndicatorKind } from './indicatorConfigs';
