import { describe, it, expect } from '@jest/globals';
import { AnalyticsDispatcher } from './analytics';
import { MemorySink } from './sinks';
import { ANALYTICS_EVENTS, EVENT_CATEGORIES, type AnalyticsEvent } from './events';

function setup() {
  const dispatcher = new AnalyticsDispatcher();
  const sink = new MemorySink();
  dispatcher.register(sink);
  return { dispatcher, sink };
}

describe('AnalyticsDispatcher', () => {
  it('diffuse un évènement assaini vers les puits enregistrés', () => {
    const { dispatcher, sink } = setup();
    dispatcher.track('exercise_answered', { skillId: 'a', grade: 3, email: 'x@y.z' });
    const [ev] = sink.recent();
    expect(ev.event).toBe('exercise_answered');
    expect(ev.props).toEqual({ skillId: 'a', grade: 3 }); // email retiré
  });

  it('ne diffuse rien quand le consentement est retiré', () => {
    const { dispatcher, sink } = setup();
    dispatcher.setConsent(false);
    dispatcher.track('app_opened');
    expect(sink.recent()).toHaveLength(0);
    dispatcher.setConsent(true);
    dispatcher.track('app_opened');
    expect(sink.recent()).toHaveLength(1);
  });

  it('un puits qui échoue n’interrompt pas la diffusion', () => {
    const { dispatcher, sink } = setup();
    dispatcher.register({
      track() {
        throw new Error('sink cassé');
      },
    });
    expect(() => dispatcher.track('app_opened')).not.toThrow();
    expect(sink.recent()).toHaveLength(1); // le puits sain reçoit quand même
  });

  it('le désenregistrement retire le puits', () => {
    const { dispatcher, sink } = setup();
    const unregister = dispatcher.register(new MemorySink());
    unregister();
    dispatcher.track('app_opened');
    expect(sink.recent()).toHaveLength(1); // seul le puits d'origine reste
  });
});

describe('MemorySink', () => {
  it('borne le tampon aux N derniers évènements', () => {
    const sink = new MemorySink(3);
    for (let i = 0; i < 5; i++) sink.track('app_opened', { i });
    const recent = sink.recent();
    expect(recent).toHaveLength(3);
    expect(recent.map((e) => e.props.i)).toEqual([2, 3, 4]);
  });
});

describe('taxonomie', () => {
  it('chaque évènement a une catégorie et ANALYTICS_EVENTS est exhaustif', () => {
    const events = ANALYTICS_EVENTS as AnalyticsEvent[];
    expect(new Set(events).size).toBe(events.length); // pas de doublon
    for (const e of events) expect(EVENT_CATEGORIES[e]).toBeDefined();
    expect(Object.keys(EVENT_CATEGORIES).sort()).toEqual([...events].sort());
  });
});
