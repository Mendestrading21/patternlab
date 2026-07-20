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
export { VolumeProfile } from './components/VolumeProfile';
export { ComparisonVisual } from './components/ComparisonVisual';
export { CheatSheetVisual } from './components/CheatSheetVisual';
export { MiniVisual } from './components/MiniVisual';
export { VisualCard } from './components/VisualCard';
export { FIGURE_OVERLAYS, figureOverlay, type FigureOverlay } from './figureOverlays';
export { RISK_SETUPS, riskSetup, type RiskSetup } from './riskSetups';
export { COMPARISONS, comparison, type Comparison, type ComparisonSide } from './comparisons';
export { CHEAT_SHEETS, cheatSheet, type CheatItem } from './cheatSheets';
export { buildVolumeProfile, type VolumeProfile as VolumeProfileData, type VolumeBin } from './volumeProfile';
export * from './indicatorMath';
export { INDICATOR_CONFIGS, indicatorConfig, type IndicatorConfig, type IndicatorKind } from './indicatorConfigs';
