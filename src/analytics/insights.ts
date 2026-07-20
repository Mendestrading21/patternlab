/**
 * Insights analytics — agrégation pure et testable (aucune I/O).
 * Transforme un tampon d'évènements (MemorySink) en un tableau de bord de transparence :
 * total, comptes par évènement, par catégorie, et entonnoir d'apprentissage. Uniquement des
 * COMPTES — aucune donnée personnelle, aucune corrélation. Sert l'écran « Journal d'usage ».
 */
import { EVENT_CATEGORIES, type AnalyticsCategory, type AnalyticsEvent } from './events';
import type { AnalyticsEnvelope } from './types';

export interface EventCount {
  event: AnalyticsEvent;
  count: number;
}
export interface CategoryCount {
  category: AnalyticsCategory;
  count: number;
}
export interface FunnelStep {
  event: AnalyticsEvent;
  label: string;
  count: number;
}
export interface Insights {
  total: number;
  byEvent: EventCount[];
  byCategory: CategoryCount[];
  funnel: FunnelStep[];
}

const CATEGORY_ORDER: AnalyticsCategory[] = ['lifecycle', 'onboarding', 'learning', 'engagement', 'monetization'];

/** Entonnoir d'apprentissage : étapes-clés dans l'ordre du parcours (comptes bruts du tampon). */
const FUNNEL: { event: AnalyticsEvent; label: string }[] = [
  { event: 'app_opened', label: 'Ouverture' },
  { event: 'lesson_started', label: 'Leçon démarrée' },
  { event: 'exercise_answered', label: 'Exercice répondu' },
  { event: 'feedback_viewed', label: 'Feedback vu' },
  { event: 'lesson_completed', label: 'Leçon terminée' },
];

export function computeInsights(events: AnalyticsEnvelope[]): Insights {
  const eventCounts = new Map<AnalyticsEvent, number>();
  const catCounts = new Map<AnalyticsCategory, number>();
  for (const e of events) {
    eventCounts.set(e.event, (eventCounts.get(e.event) ?? 0) + 1);
    const cat = EVENT_CATEGORIES[e.event];
    if (cat) catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
  }
  const byEvent = [...eventCounts.entries()]
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count || a.event.localeCompare(b.event));
  const byCategory = CATEGORY_ORDER.map((category) => ({ category, count: catCounts.get(category) ?? 0 })).filter(
    (c) => c.count > 0,
  );
  const funnel = FUNNEL.map((s) => ({ ...s, count: eventCounts.get(s.event) ?? 0 }));
  return { total: events.length, byEvent, byCategory, funnel };
}
