/** Types partagés de la couche analytics (indépendante du fournisseur). */
import type { AnalyticsEvent } from './events';

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export interface AnalyticsEnvelope {
  event: AnalyticsEvent;
  props: AnalyticsProps;
}

/** Puits de sortie (console, mémoire, futur fournisseur…). Reçoit des propriétés déjà assainies. */
export interface AnalyticsSink {
  track(event: AnalyticsEvent, props: AnalyticsProps): void;
}
