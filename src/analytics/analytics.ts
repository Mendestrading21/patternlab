/**
 * Dispatcher analytics — typé, indépendant du fournisseur, respectueux de la vie privée.
 *
 * Pipeline d'un évènement : consentement → assainissement (privacy) → diffusion vers les
 * puits enregistrés. Un puits qui échoue ne casse jamais l'application. Aucun envoi réseau
 * ici : brancher un fournisseur validé = enregistrer un puits.
 */
import type { AnalyticsEvent } from './events';
import type { AnalyticsEnvelope, AnalyticsProps, AnalyticsSink } from './types';
import { sanitizeProps } from './privacy';
import { ConsoleSink, MemorySink } from './sinks';

export interface Analytics {
  track(event: AnalyticsEvent, props?: AnalyticsProps): void;
  /** Enregistre un puits ; retourne une fonction de désenregistrement. */
  register(sink: AnalyticsSink): () => void;
  /** Consentement (opt-out) : si false, aucun évènement n'est diffusé. */
  setConsent(enabled: boolean): void;
  isEnabled(): boolean;
  /**
   * Derniers évènements diffusés (bornés), lus depuis le MÊME objet que `track` —
   * garantit à l'écran « Journal d'usage » de voir exactement ce qui a été enregistré,
   * sans dépendre du partage d'un puits importé séparément.
   */
  recent(): AnalyticsEnvelope[];
  clearRecent(): void;
}

export class AnalyticsDispatcher implements Analytics {
  private sinks: AnalyticsSink[] = [];
  private enabled = true;
  private readonly buffer: AnalyticsEnvelope[] = [];

  constructor(private readonly limit = 50) {}

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
    // Tampon interne (source de vérité du journal), puis diffusion aux puits.
    this.buffer.push({ event, props: clean });
    if (this.buffer.length > this.limit) this.buffer.shift();
    for (const sink of this.sinks) {
      try {
        sink.track(event, clean);
      } catch {
        /* un puits ne doit jamais interrompre l'application */
      }
    }
  }

  recent(): AnalyticsEnvelope[] {
    return [...this.buffer];
  }

  clearRecent(): void {
    this.buffer.length = 0;
  }
}

const env = process.env.NODE_ENV;

/** Tampon en mémoire des derniers évènements (débogage). */
export const memorySink = new MemorySink();

/**
 * Singleton applicatif, ancré sur `globalThis`.
 *
 * Le rendu statique d'Expo Router (web) peut évaluer ce module plusieurs fois (serveur +
 * hydratation, frontières de bundle) : sans ancrage, on obtiendrait plusieurs dispatchers,
 * et l'écran « Journal d'usage » lirait un tampon différent de celui où les écrans écrivent.
 * L'ancrage `globalThis` garantit UNE seule instance (et un seul enregistrement des puits).
 */
function createAnalytics(): Analytics {
  const a = new AnalyticsDispatcher();
  a.register(memorySink);
  if (env === 'development') a.register(new ConsoleSink());
  return a;
}

const globalStore = globalThis as unknown as { __patternlabAnalytics?: Analytics };
export const analytics: Analytics = globalStore.__patternlabAnalytics ?? (globalStore.__patternlabAnalytics = createAnalytics());

/**
 * Lit les derniers évènements depuis le singleton ancré sur `globalThis`, **au moment de l'appel**.
 * Robuste même si ce module est dupliqué dans le bundle : `globalThis` est universel, donc on
 * atteint toujours l'instance où les écrans écrivent (source de vérité du « Journal d'usage »).
 */
export function recentEvents(): AnalyticsEnvelope[] {
  return globalStore.__patternlabAnalytics?.recent() ?? [];
}

export function clearRecentEvents(): void {
  globalStore.__patternlabAnalytics?.clearRecent();
}
