/** Puits analytics concrets (indépendants du fournisseur). */
import type { AnalyticsEvent } from './events';
import type { AnalyticsEnvelope, AnalyticsProps, AnalyticsSink } from './types';

/** Journalise dans la console (développement uniquement). */
export class ConsoleSink implements AnalyticsSink {
  track(event: AnalyticsEvent, props: AnalyticsProps): void {
    console.log(`[analytics] ${event}`, props);
  }
}

/**
 * Conserve les derniers évènements en mémoire (débogage, tests, futur écran « journal »).
 * Borné : les plus anciens sont évincés au-delà de `limit`.
 */
export class MemorySink implements AnalyticsSink {
  private buffer: AnalyticsEnvelope[] = [];

  constructor(private readonly limit = 50) {}

  track(event: AnalyticsEvent, props: AnalyticsProps): void {
    this.buffer.push({ event, props });
    if (this.buffer.length > this.limit) this.buffer.shift();
  }

  recent(): AnalyticsEnvelope[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }
}
