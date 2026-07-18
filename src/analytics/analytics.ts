/**
 * Dispatcher analytics — typé, indépendant du fournisseur, respectueux de la vie privée.
 *
 * Pipeline d'un évènement : consentement → assainissement (privacy) → diffusion vers les
 * puits enregistrés. Un puits qui échoue ne casse jamais l'application. Aucun envoi réseau
 * ici : brancher un fournisseur validé = enregistrer un puits.
 */
import type { AnalyticsEvent } from './events';
import type { AnalyticsProps, AnalyticsSink } from './types';
import { sanitizeProps } from './privacy';
import { ConsoleSink, MemorySink } from './sinks';

export interface Analytics {
  track(event: AnalyticsEvent, props?: AnalyticsProps): void;
  /** Enregistre un puits ; retourne une fonction de désenregistrement. */
  register(sink: AnalyticsSink): () => void;
  /** Consentement (opt-out) : si false, aucun évènement n'est diffusé. */
  setConsent(enabled: boolean): void;
  isEnabled(): boolean;
}

export class AnalyticsDispatcher implements Analytics {
  private sinks: AnalyticsSink[] = [];
  private enabled = true;

  register(sink: AnalyticsSink): () => void {
    this.sinks.push(sink);
    return () => {
      this.sinks = this.sinks.filter((s) => s !== sink);
    };
  }

  setConsent(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  track(event: AnalyticsEvent, props?: AnalyticsProps): void {
    if (!this.enabled) return;
    const clean = sanitizeProps(props);
    for (const sink of this.sinks) {
      try {
        sink.track(event, clean);
      } catch {
        /* un puits ne doit jamais interrompre l'application */
      }
    }
  }
}

const env = process.env.NODE_ENV;

/** Tampon en mémoire des derniers évènements (débogage / futur écran journal). */
export const memorySink = new MemorySink();

/** Singleton applicatif. */
export const analytics: Analytics = new AnalyticsDispatcher();
analytics.register(memorySink);
if (env === 'development') analytics.register(new ConsoleSink());
