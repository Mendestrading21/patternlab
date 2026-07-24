export { theme, useTheme, type Theme } from './theme';
export * from './tokens';
export * from './tone';
export * from './a11y';
export { useReducedMotion } from './useReducedMotion';
export {
  contrastRatio,
  relativeLuminance,
  meetsAA,
  hexToRgb,
  WCAG_AA_NORMAL,
  WCAG_AA_LARGE,
} from './contrast';
export {
  TrademyIcon,
  TRADEMY_ICON_NAMES,
  type TrademyIconName,
  type TrademyIconProps,
  BrandLogo,
  type BrandLogoProps,
} from './icons';
export { Text, type AppTextProps } from './components/Text';
export { Button, type ButtonProps } from './components/Button';
export { IconButton, type IconButtonProps } from './components/IconButton';
export { ProgressRing, type ProgressRingProps } from './components/ProgressRing';
export { XPBar, type XPBarProps } from './components/XPBar';
export { Card, type CardProps } from './components/Card';
export { GlassCard, type GlassCardProps } from './components/GlassCard';
export { ProgressBar, type ProgressBarProps } from './components/ProgressBar';
export { Chip, type ChipProps } from './components/Chip';
export { Badge, type BadgeProps } from './components/Badge';
export { FavoriteButton, type FavoriteButtonProps } from './components/FavoriteButton';
export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentOption,
} from './components/SegmentedControl';
export { Screen, type ScreenProps } from './components/Screen';
export { EmptyState, type EmptyStateProps } from './components/EmptyState';
export { StateView, type StateViewProps, type StateVariant } from './components/StateView';
export { Skeleton, type SkeletonProps } from './components/Skeleton';
export { OfflineBanner, type OfflineBannerProps } from './components/OfflineBanner';
export { AnswerOption, type AnswerOptionProps, type AnswerState } from './components/AnswerOption';
export { FeedbackPanel, type FeedbackPanelProps } from './components/FeedbackPanel';
export { Flashcard, type FlashcardProps } from './components/Flashcard';
// LOT 4 — fondation visuelle : état de marché, tuiles & widget de progression.
export {
  MarketStatePill,
  MARKET_STATES,
  MARKET_STATE_ORDER,
  type MarketState,
  type MarketStatePillProps,
} from './components/MarketStatePill';
export { StatTile, type StatTileProps } from './components/StatTile';
export { ProgressWidget, type ProgressWidgetProps } from './components/ProgressWidget';
