import { theme } from '@/design-system/theme';
import type { TrademyIconName } from '@/design-system/icons/TrademyIcon';
import type { LessonStepKind } from '@/engines/learning';

export type LessonStepMeta = {
  label: string;
  color: string;
  icon?: TrademyIconName;
  accent?: string;
};

/** Métadonnées d'affichage par type d'étape (icône Trademy + libellé + couleur sémantique). */
export const STEP_META: Record<LessonStepKind, LessonStepMeta> = {
  intro: { label: 'Pour commencer', color: theme.colors.primaryBright, icon: 'hint' },
  explain: { label: 'Explication', color: theme.colors.textMuted },
  observe: { label: 'Observe', color: theme.colors.technical, icon: 'target' },
  example: { label: 'Exemple', color: theme.colors.textMuted },
  chart: { label: 'Graphique', color: theme.colors.technical, icon: 'chart' },
  visual: { label: 'Le visuel', color: theme.colors.technical, icon: 'chart' },
  hypothesis: {
    label: 'Hypothèse — Toto / Bobo',
    color: theme.colors.advanced,
    icon: 'risk',
    accent: theme.colors.advanced,
  },
  interaction: { label: 'À toi', color: theme.colors.primary },
  warning: { label: 'Attention', color: theme.colors.warning, icon: 'warning', accent: theme.colors.warning },
  falseSignal: {
    label: 'Faux signal / limite',
    color: theme.colors.falseSignal,
    icon: 'false-signal',
    accent: theme.colors.falseSignal,
  },
  summary: { label: 'À retenir', color: theme.colors.primary, icon: 'target', accent: theme.colors.primary },
  flashcard: { label: '', color: '' },
};
