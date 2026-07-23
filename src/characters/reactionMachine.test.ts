import { describe, it, expect } from '@jest/globals';
import {
  initialReactionState,
  sendEvent,
  tick,
  durationMs,
  resolveWithGuide,
  GUIDE_CARRIED_STATES,
  type ReactionState,
} from './reactionMachine';
import { CHARACTER_STATES } from './states';
import type { MascotEvent } from './orchestrator';
import type { CharacterState } from './types';

// Applique une suite d'événements à horodatages croissants (intégration du parcours).
function run(events: { event: MascotEvent; at: number; speech?: string; guide?: 'toto' | 'bobo' }[]): ReactionState {
  let s = initialReactionState();
  for (const e of events) s = sendEvent(s, e.event, e.at, { speech: e.speech, guide: e.guide });
  return s;
}

describe('durationMs — la durée vient du token de l’état (pas toujours instant)', () => {
  it('les durées reflètent la catégorie de l’état', () => {
    expect(durationMs('idle')).toBe(100); // instant
    expect(durationMs('celebrate-small')).toBe(550); // expressive
    expect(durationMs('celebrate-big')).toBe(720); // celebration
    // au moins deux durées distinctes sont réellement utilisées
    const sample: CharacterState[] = ['idle', 'wrong', 'celebrate-small', 'celebrate-big'];
    expect(new Set(sample.map(durationMs)).size).toBeGreaterThan(1);
  });
});

describe('reactionMachine — parcours pédagogique complet (intégration)', () => {
  it('émet les bons états dans l’ordre d’une session', () => {
    let s = initialReactionState();
    const seen: (string | null)[] = [];
    const seq: MascotEvent[] = [
      { type: 'lesson_started' },
      { type: 'chart_revealed' },
      { type: 'answer_correct', streak: 1 },
      { type: 'answer_incorrect' },
      { type: 'checkpoint_started' },
      { type: 'checkpoint_completed', passed: true },
    ];
    let t = 0;
    for (const e of seq) {
      s = sendEvent(s, e, (t += 10_000));
      seen.push(s.active?.state ?? null); // réaction dominante juste après l'événement
      // Simule le timer d'auto-idle qui se déclenche AVANT l'événement suivant (comme dans le hook).
      s = tick(s, t + 5_000);
    }
    expect(seen).toEqual(['welcome', 'observe', 'celebrate-small', 'wrong', 'review', 'celebrate-big']);
  });

  it('answer_correct passe réellement par l’orchestrateur (série ≥ 3 → streak)', () => {
    const s = run([{ event: { type: 'answer_correct', streak: 3 }, at: 1 }]);
    expect(s.active?.state).toBe('streak');
  });

  it('une misconception déclenche Bobo (faux signal), quel que soit le guide', () => {
    const s = run([{ event: { type: 'misconception_detected' }, at: 1, guide: 'toto' }]);
    expect(s.active?.state).toBe('false-signal');
    expect(s.active?.character).toBe('bobo');
  });
});

describe('reactionMachine — priorités & interruptible (pickReaction réel)', () => {
  it('une réaction moins prioritaire ne remplace pas une réaction NON interruptible', () => {
    let s = sendEvent(initialReactionState(), { type: 'checkpoint_completed', passed: true }, 0); // celebrate-big, non interruptible
    s = sendEvent(s, { type: 'answer_correct' }, 1); // celebrate-small, moindre priorité
    expect(s.active?.state).toBe('celebrate-big');
  });

  it('offline (système critique) écrase même une célébration non interruptible', () => {
    let s = sendEvent(initialReactionState(), { type: 'checkpoint_completed', passed: true }, 0);
    s = sendEvent(s, { type: 'offline_detected' }, 1);
    expect(s.active?.state).toBe('offline');
    expect(s.active?.character).toBe('bobo');
  });

  it('online_restored libère l’état hors-ligne (retour à idle)', () => {
    let s = sendEvent(initialReactionState(), { type: 'offline_detected' }, 0);
    expect(s.active?.state).toBe('offline');
    s = sendEvent(s, { type: 'online_restored' }, 1);
    expect(s.active).toBeNull();
  });

  it('online_restored n’efface pas une réaction non-offline', () => {
    let s = sendEvent(initialReactionState(), { type: 'answer_correct' }, 0);
    s = sendEvent(s, { type: 'online_restored' }, 1);
    expect(s.active?.state).toBe('celebrate-small');
  });
});

describe('reactionMachine — retour à idle piloté par la durée', () => {
  it('returnsToIdle=true revient à idle après la durée de l’état', () => {
    const s = sendEvent(initialReactionState(), { type: 'answer_correct' }, 0); // celebrate-small, 550 ms, returnsToIdle
    expect(CHARACTER_STATES['celebrate-small'].returnsToIdle).toBe(true);
    expect(tick(s, 549).active?.state).toBe('celebrate-small'); // avant l’échéance : maintenu
    expect(tick(s, 550).active).toBeNull(); // à l’échéance : retour à idle
  });

  it('offline (returnsToIdle=false) NE revient jamais à idle tout seul', () => {
    const s = sendEvent(initialReactionState(), { type: 'offline_detected' }, 0);
    expect(s.idleAt).toBeNull();
    expect(tick(s, 10_000_000).active?.state).toBe('offline');
  });
});

describe('reactionMachine — reprise & checkpoints', () => {
  it('une reprise de session ne rejoue AUCUNE célébration', () => {
    const s = run([{ event: { type: 'session_resumed' }, at: 1 }]);
    expect(s.active?.state).toBe('welcome');
    expect(['celebrate-small', 'celebrate-big', 'streak', 'level-up']).not.toContain(s.active?.state);
  });

  it('un checkpoint ÉCHOUÉ n’est jamais célébré (encourage)', () => {
    const s = run([{ event: { type: 'checkpoint_completed', passed: false }, at: 1 }]);
    expect(s.active?.state).toBe('encourage');
  });

  it('un checkpoint RÉUSSI déclenche une célébration proportionnelle (celebrate-big)', () => {
    const s = run([{ event: { type: 'checkpoint_completed', passed: true }, at: 1 }]);
    expect(s.active?.state).toBe('celebrate-big');
  });
});

describe('reactionMachine — guide choisi (moments neutres) vs rôles canoniques', () => {
  it('le guide choisi porte les introductions/observations/encouragements neutres', () => {
    expect(resolveWithGuide({ type: 'lesson_started' }, 'bobo').character).toBe('bobo'); // welcome
    expect(resolveWithGuide({ type: 'chart_revealed' }, 'bobo').character).toBe('bobo'); // observe
    expect(resolveWithGuide({ type: 'retry_started' }, 'bobo').character).toBe('bobo'); // encourage
  });

  it('choisir Toto n’empêche jamais Bobo d’expliquer une erreur', () => {
    expect(resolveWithGuide({ type: 'misconception_detected' }, 'toto').character).toBe('bobo');
    expect(resolveWithGuide({ type: 'answer_incorrect' }, 'toto').character).toBe('bobo');
  });

  it('choisir Bobo ne le rend pas baissier : une bonne réponse reste Toto qui célèbre', () => {
    expect(resolveWithGuide({ type: 'answer_correct' }, 'bobo').character).toBe('toto');
    expect(resolveWithGuide({ type: 'level_completed' }, 'bobo').character).toBe('toto');
  });

  it('les états à rôle canonique ne sont jamais « portables » par le guide', () => {
    for (const s of ['false-signal', 'wrong', 'warning', 'celebrate-small', 'celebrate-big', 'streak', 'level-up', 'explain']) {
      expect(GUIDE_CARRIED_STATES.has(s as never)).toBe(false);
    }
  });

  it('sans guide choisi, les personnages par défaut du registre s’appliquent', () => {
    expect(resolveWithGuide({ type: 'lesson_started' }).character).toBe('toto');
  });
});
