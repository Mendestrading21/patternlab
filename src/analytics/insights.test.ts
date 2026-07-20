import { describe, it, expect } from '@jest/globals';
import { computeInsights } from './insights';
import type { AnalyticsEnvelope } from './types';
import type { AnalyticsEvent } from './events';

const env = (event: AnalyticsEvent): AnalyticsEnvelope => ({ event, props: {} });

describe('computeInsights', () => {
  it('journal vide : totaux à zéro, entonnoir présent', () => {
    const r = computeInsights([]);
    expect(r.total).toBe(0);
    expect(r.byEvent).toEqual([]);
    expect(r.byCategory).toEqual([]);
    expect(r.funnel.every((s) => s.count === 0)).toBe(true);
    expect(r.funnel.map((s) => s.event)).toContain('app_opened');
    expect(r.funnel.map((s) => s.event)).toContain('lesson_completed');
  });

  it('compte par évènement (trié desc) et par catégorie (ordre fixe)', () => {
    const events: AnalyticsEnvelope[] = [
      env('app_opened'),
      env('lesson_started'),
      env('exercise_answered'),
      env('exercise_answered'),
      env('feedback_viewed'),
      env('feedback_viewed'),
      env('feedback_viewed'),
      env('world_opened'),
      env('subscription_started'),
    ];
    const r = computeInsights(events);
    expect(r.total).toBe(9);
    expect(r.byEvent[0]).toEqual({ event: 'feedback_viewed', count: 3 });
    const cat = Object.fromEntries(r.byCategory.map((c) => [c.category, c.count]));
    expect(cat.learning).toBe(6); // lesson_started + exercise_answered×2 + feedback_viewed×3
    expect(cat.lifecycle).toBe(1);
    expect(cat.engagement).toBe(1);
    expect(cat.monetization).toBe(1);
    expect(r.byCategory.map((c) => c.category)).toEqual(['lifecycle', 'learning', 'engagement', 'monetization']);
  });

  it('entonnoir d’apprentissage : comptes des étapes-clés', () => {
    const events = [env('app_opened'), env('app_opened'), env('lesson_started'), env('lesson_completed')];
    const f = Object.fromEntries(computeInsights(events).funnel.map((s) => [s.event, s.count]));
    expect(f['app_opened']).toBe(2);
    expect(f['lesson_started']).toBe(1);
    expect(f['exercise_answered']).toBe(0);
    expect(f['lesson_completed']).toBe(1);
  });
});
