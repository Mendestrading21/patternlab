import type { AnalyticsEvent } from './events';

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export interface Analytics {
  track(event: AnalyticsEvent, props?: AnalyticsProps): void;
}

const isDev = process.env.NODE_ENV !== 'production';

/** Logger de développement (console). En prod, brancher un vrai fournisseur validé côté privacy. */
class ConsoleAnalytics implements Analytics {
  track(event: AnalyticsEvent, props?: AnalyticsProps): void {
    console.log(`[analytics] ${event}`, props ?? {});
  }
}

class NoopAnalytics implements Analytics {
  track(): void {
    /* no-op */
  }
}

export const analytics: Analytics = isDev ? new ConsoleAnalytics() : new NoopAnalytics();
